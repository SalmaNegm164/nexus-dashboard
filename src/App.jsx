
import { useState, useEffect, useRef } from "react";
import {
  Users,
  ShoppingCart,
  Wallet,
  ArrowDownRight,
  ChartNoAxesCombined,
  X,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import RevenueChart from "./components/RevenueChart";
import TransactionsTable from "./components/TransactionsTable";
import Toast from "./components/Toast";
import AnalyticsPage from "./components/AnalyticsPage";
import CustomersPage from "./components/CustomersPage";
import OrdersPage from "./components/OrdersPage";
import SettingsPage from "./components/SettingsPage";

import "./styles/layout.css";
import "./styles/Overview.css";
import "./styles/analytics.css";
import "./styles/Customers.css";
import "./styles/Orders.css";
import "./styles/theme.css";
import "./styles/transactions.css";
import "./styles/settings.css";
import "./App.css";

const statsByPeriod = {
  Monthly: [
    { title: "Total Revenue", value: "$48,294", change: "+12.8%", positive: true, icon: Wallet, color: "blue" },
    { title: "Total Users", value: "12,840", change: "+8.2%", positive: true, icon: Users, color: "purple" },
    { title: "Total Orders", value: "3,642", change: "-2.4%", positive: false, icon: ShoppingCart, color: "orange" },
    { title: "Conversion Rate", value: "4.82%", change: "+1.6%", positive: true, icon: ChartNoAxesCombined, color: "green" },
  ],
  Weekly: [
    { title: "Total Revenue", value: "$47,900", change: "+5.4%", positive: true, icon: Wallet, color: "blue" },
    { title: "Total Users", value: "3,240", change: "+6.1%", positive: true, icon: Users, color: "purple" },
    { title: "Total Orders", value: "864", change: "+3.2%", positive: true, icon: ShoppingCart, color: "orange" },
    { title: "Conversion Rate", value: "4.35%", change: "-0.5%", positive: false, icon: ChartNoAxesCombined, color: "green" },
  ],
  Daily: [
    { title: "Total Revenue", value: "$21,500", change: "+9.3%", positive: true, icon: Wallet, color: "blue" },
    { title: "Total Users", value: "428", change: "+4.7%", positive: true, icon: Users, color: "purple" },
    { title: "Total Orders", value: "96", change: "+2.1%", positive: true, icon: ShoppingCart, color: "orange" },
    { title: "Conversion Rate", value: "3.91%", change: "-1.2%", positive: false, icon: ChartNoAxesCombined, color: "green" },
  ],
};

const initialTransactions = [
  { id: "TXN-1001", customer: "Olivia Martin", email: "olivia@example.com", date: "2026-10-10", amount: 249.99, status: "Completed", method: "Credit Card" },
  { id: "TXN-1002", customer: "Jackson Lee", email: "jackson@example.com", date: "2026-10-09", amount: 125.5, status: "Pending", method: "PayPal" },
  { id: "TXN-1003", customer: "Isabella Chen", email: "isabella@example.com", date: "2026-10-08", amount: 560, status: "Completed", method: "Credit Card" },
  { id: "TXN-1004", customer: "William Kim", email: "william@example.com", date: "2026-10-07", amount: 89.99, status: "Failed", method: "Bank Transfer" },
  { id: "TXN-1005", customer: "Sophia Patel", email: "sophia@example.com", date: "2026-10-06", amount: 320.75, status: "Completed", method: "PayPal" },
  { id: "TXN-1006", customer: "Noah Wilson", email: "noah@example.com", date: "2026-10-05", amount: 175, status: "Pending", method: "Credit Card" },
  { id: "TXN-1007", customer: "Ava Thompson", email: "ava@example.com", date: "2026-10-04", amount: 410.25, status: "Completed", method: "Bank Transfer" },
  { id: "TXN-1008", customer: "Ethan Davis", email: "ethan@example.com", date: "2026-10-03", amount: 64.5, status: "Failed", method: "PayPal" },
];

const emptyForm = {
  customer: "",
  email: "",
  amount: "",
  method: "Credit Card",
  status: "Pending",
};

function App() {
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  function showToast(type, title, message) {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ id: Date.now(), type, title, message });

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3500);
  }

  function dismissToast() {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    setToast(null);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const [theme, setTheme] = useState("dark");
  const [activePage, setActivePage] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState("Monthly");
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState(initialTransactions);
  const [modalMode, setModalMode] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const [transactionSearch, setTransactionSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending",
  });

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  const stats = statsByPeriod[chartPeriod];

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "Completed"
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "Pending"
  );

  const failedTransactions = transactions.filter(
    (transaction) => transaction.status === "Failed"
  );

  const totalRevenue = completedTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  const pendingAmount = pendingTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  const formatCurrency = (amount) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  function generateTransactionId(currentTransactions) {
    const highestId = currentTransactions.reduce((highest, transaction) => {
      const match = String(transaction.id).match(/^TXN-(\d+)$/);

      if (!match) return highest;

      return Math.max(highest, Number(match[1]));
    }, 1000);

    return `TXN-${highestId + 1}`;
  }

  function exportTransactionsToCSV() {
    const headers = [
      "Transaction ID",
      "Customer",
      "Email",
      "Amount",
      "Date",
      "Payment Method",
      "Status",
    ];

    const csvRows = transactions.map((transaction) => [
      transaction.id,
      transaction.customer,
      transaction.email,
      transaction.amount,
      transaction.date,
      transaction.method,
      transaction.status,
    ]);

    const escapeCSVValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSVValue).join(","),
      ...csvRows.map((row) => row.map(escapeCSVValue).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexus-transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast(
      "success",
      "Export Successful",
      "Your transactions CSV file is ready."
    );
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const query = transactionSearch.toLowerCase().trim();

    const matchesSearch =
      transaction.id.toLowerCase().includes(query) ||
      transaction.customer.toLowerCase().includes(query) ||
      transaction.email.toLowerCase().includes(query) ||
      transaction.method.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleSort(key) {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "ascending"
          ? "descending"
          : "ascending",
    }));

    setCurrentPage(1);
  }

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const { key, direction } = sortConfig;
    let comparison = 0;

    if (key === "amount") {
      comparison = Number(a.amount) - Number(b.amount);
    } else if (key === "date") {
      comparison = a.date.localeCompare(b.date);
    } else {
      comparison = String(a[key] ?? "").localeCompare(
        String(b[key] ?? ""),
        undefined,
        { sensitivity: "base" }
      );
    }

    return direction === "ascending" ? comparison : -comparison;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedTransactions.length / rowsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;

  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  function handleAddTransaction() {
    setEditingTransaction(null);
    setEditForm({ ...emptyForm });
    setModalMode("add");
  }

  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction);

    setEditForm({
      customer: transaction.customer,
      email: transaction.email,
      amount: String(transaction.amount),
      method: transaction.method,
      status: transaction.status,
    });

    setModalMode("edit");
  }

  function handleEditFormChange(event) {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function closeTransactionModal() {
    setModalMode(null);
    setEditingTransaction(null);
    setEditForm({ ...emptyForm });
  }

  function handleSaveTransaction(event) {
    event.preventDefault();

    const customer = editForm.customer.trim();
    const email = editForm.email.trim();
    const amount = Number(editForm.amount);

    if (
      !customer ||
      !email ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      showToast(
        "error",
        "Invalid Transaction",
        "Please enter valid details and an amount greater than zero."
      );
      return;
    }

    if (modalMode === "add") {
      const newTransaction = {
        id: generateTransactionId(transactions),
        customer,
        email,
        date: new Date().toISOString().slice(0, 10),
        amount,
        method: editForm.method,
        status: editForm.status,
      };

      setTransactions((current) => [newTransaction, ...current]);
      setStatusFilter("All");
      setTransactionSearch("");
      setCurrentPage(1);

      showToast(
        "success",
        "Transaction Added",
        `${customer}'s transaction was added successfully.`
      );
    } else if (modalMode === "edit" && editingTransaction) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === editingTransaction.id
            ? {
              ...transaction,
              customer,
              email,
              amount,
              method: editForm.method,
              status: editForm.status,
            }
            : transaction
        )
      );

      showToast(
        "success",
        "Changes Saved",
        `${customer}'s transaction was updated successfully.`
      );
    }

    closeTransactionModal();
  }

  function handleDeleteTransaction(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    const deletedTransaction = transactions.find(
      (transaction) => transaction.id === id
    );

    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );

    showToast(
      "success",
      "Transaction Deleted",
      `${deletedTransaction?.id ?? id} was deleted successfully.`
    );

    if (editingTransaction?.id === id) {
      closeTransactionModal();
    }
  }

  function handleUpdateOrderStatus(id, newStatus) {
    const validStatuses = ["Pending", "Completed", "Failed"];

    if (!validStatuses.includes(newStatus)) {
      showToast(
        "error",
        "Invalid Status",
        "Please select a valid order status."
      );
      return;
    }

    const order = transactions.find((transaction) => transaction.id === id);

    if (!order) {
      showToast(
        "error",
        "Order Not Found",
        "This order could not be found."
      );
      return;
    }

    if (order.status === newStatus) return;

    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: newStatus }
          : transaction
      )
    );

    showToast(
      "success",
      "Order Updated",
      `${id} status changed to ${newStatus}.`
    );
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <Toast toast={toast} onDismiss={dismissToast} />

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        transactionCount={transactions.length}
      />

      <main className="main-content">
        <Topbar
          activePage={activePage}
          setMenuOpen={setMenuOpen}
          theme={theme}
          toggleTheme={toggleTheme}
          search={search}
          setSearch={setSearch}
        />

        {activePage === "Settings" ? (
          <SettingsPage
            theme={theme}
            onThemeChange={setTheme}
          />
        ) : activePage === "Analytics" ? (
          <AnalyticsPage transactions={transactions} />
        ) : activePage === "Customers" ? (
          <CustomersPage transactions={transactions} />
        ) : activePage === "Orders" ? (
          <OrdersPage
            transactions={transactions}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        ) : (
          <section className="dashboard-content">
            <div className="welcome-row">
              <div>
                <div className="eyebrow">
                  <span className="status-dot" />
                  YOUR BUSINESS AT A GLANCE
                </div>

                <h1>{activePage}</h1>

                <p className="page-description">
                  Welcome back, Salma. Here's what's happening with your
                  business today.
                </p>
              </div>

              <button
                type="button"
                className="date-button"
                onClick={() => setActivePage("Analytics")}
              >
                Last 30 days <span>⌄</span>
              </button>
            </div>

            <div className="section-heading">
              <div>
                <h2>Overview</h2>
                <p>Track your key performance metrics.</p>
              </div>

              <span className="live-label">
                <span className="status-dot" /> Demo overview
              </span>
            </div>

            <div className="stats-grid">
              {stats
                .filter((stat) =>
                  `${stat.title} ${stat.value}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((stat) => (
                  <StatCard
                    key={stat.title}
                    stat={stat}
                    chartPeriod={chartPeriod}
                    setActivePage={setActivePage}
                  />
                ))}
            </div>

            <div className="lower-grid">
              <RevenueChart
                chartPeriod={chartPeriod}
                setChartPeriod={setChartPeriod}
              />

              <section className="panel activity-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Activity</h2>
                    <p>Your latest business updates.</p>
                  </div>

                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setActivePage("Orders")}
                  >
                    View all
                  </button>
                </div>

                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon blue">
                      <ShoppingCart size={17} />
                    </div>
                    <div className="activity-details">
                      <strong>New order received</strong>
                      <span>Order #NX-2048</span>
                    </div>
                    <time>2m ago</time>
                  </div>

                  <div className="activity-item">
                    <div className="activity-icon purple">
                      <Users size={17} />
                    </div>
                    <div className="activity-details">
                      <strong>New customer joined</strong>
                      <span>Customer registration</span>
                    </div>
                    <time>18m ago</time>
                  </div>

                  <div className="activity-item">
                    <div className="activity-icon green">
                      <Wallet size={17} />
                    </div>
                    <div className="activity-details">
                      <strong>Payment completed</strong>
                      <span>Invoice #INV-0932</span>
                    </div>
                    <time>42m ago</time>
                  </div>

                  <div className="activity-item">
                    <div className="activity-icon orange">
                      <ChartNoAxesCombined size={17} />
                    </div>
                    <div className="activity-details">
                      <strong>Weekly report ready</strong>
                      <span>Business analytics</span>
                    </div>
                    <time>1h ago</time>
                  </div>
                </div>
              </section>
            </div>

            <div className="transaction-summary-grid">
              <article className="summary-card">
                <div className="summary-card-top">
                  <div className="summary-icon summary-blue">
                    <ShoppingCart size={21} />
                  </div>
                  <span className="summary-label">All Transactions</span>
                </div>
                <h3>{transactions.length.toLocaleString("en-US")}</h3>
                <p>Total transactions recorded</p>
              </article>

              <article className="summary-card">
                <div className="summary-card-top">
                  <div className="summary-icon summary-green">
                    <Wallet size={21} />
                  </div>
                  <span className="summary-label">Total Revenue</span>
                </div>
                <h3>{formatCurrency(totalRevenue)}</h3>
                <p>From completed transactions</p>
              </article>

              <article className="summary-card">
                <div className="summary-card-top">
                  <div className="summary-icon summary-orange">
                    <ArrowDownRight size={21} />
                  </div>
                  <span className="summary-label">Pending Payments</span>
                </div>
                <h3>{pendingTransactions.length.toLocaleString("en-US")}</h3>
                <p>{formatCurrency(pendingAmount)} awaiting completion</p>
              </article>

              <article className="summary-card">
                <div className="summary-card-top">
                  <div className="summary-icon summary-red">
                    <X size={21} />
                  </div>
                  <span className="summary-label">Failed Transactions</span>
                </div>
                <h3>{failedTransactions.length.toLocaleString("en-US")}</h3>
                <p>Unsuccessful transactions</p>
              </article>
            </div>

            <TransactionsTable
              transactions={transactions}
              filteredTransactions={filteredTransactions}
              sortedTransactions={sortedTransactions}
              paginatedTransactions={paginatedTransactions}
              transactionSearch={transactionSearch}
              setTransactionSearch={setTransactionSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              currentPage={safeCurrentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              sortConfig={sortConfig}
              handleSort={handleSort}
              handleAddTransaction={handleAddTransaction}
              handleEditTransaction={handleEditTransaction}
              handleDeleteTransaction={handleDeleteTransaction}
              exportTransactionsToCSV={exportTransactionsToCSV}
              formatCurrency={formatCurrency}
            />

            <footer className="dashboard-footer">
              <span>© 2026 Nexus Analytics</span>
              <span>Designed &amp; built with React</span>
            </footer>
          </section>
        )}
      </main>

      {modalMode && (
        <div
          className="edit-modal-overlay"
          onClick={closeTransactionModal}
        >
          <div
            className="edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="edit-modal-header">
              <div>
                <h2 id="edit-modal-title">
                  {modalMode === "add"
                    ? "Add Transaction"
                    : "Edit Transaction"}
                </h2>
                <p>
                  {modalMode === "add"
                    ? "Enter the details for your new transaction."
                    : "Update transaction details below."}
                </p>
              </div>

              <button
                type="button"
                className="edit-modal-close"
                onClick={closeTransactionModal}
                aria-label="Close transaction modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction}>
              {modalMode === "add" && (
                <div className="edit-form-group">
                  <label>Transaction ID</label>
                  <input
                    value={generateTransactionId(transactions)}
                    readOnly
                    aria-label="Generated transaction ID"
                  />
                  <small className="form-helper-text">
                    Generated automatically when you add the transaction.
                  </small>
                </div>
              )}

              <div className="edit-form-group">
                <label htmlFor="edit-customer">Customer Name</label>
                <input
                  id="edit-customer"
                  name="customer"
                  value={editForm.customer}
                  onChange={handleEditFormChange}
                  placeholder="e.g. Salma Ahmed"
                  required
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-email">Email Address</label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-amount">Amount ($)</label>
                <input
                  id="edit-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={editForm.amount}
                  onChange={handleEditFormChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-method">Payment Method</label>
                <select
                  id="edit-method"
                  name="method"
                  value={editForm.method}
                  onChange={handleEditFormChange}
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="edit-form-group">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditFormChange}
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="edit-modal-actions">
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={closeTransactionModal}
                >
                  Cancel
                </button>

                <button type="submit" className="save-edit-btn">
                  {modalMode === "add"
                    ? "Add Transaction"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
