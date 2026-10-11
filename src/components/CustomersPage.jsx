import { useMemo, useState } from "react";
import {
  Users,
  UserRoundPlus,
  Search,
  ShoppingCart,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Crown,
  UserRound,
  CalendarDays,
  X,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
  Hash,
} from "lucide-react";

const PAGE_SIZE = 5;

function formatCurrency(amount) {
  return `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "C"
  );
}

function getStatusIcon(status) {
  if (status === "Completed") return CheckCircle2;
  if (status === "Failed") return XCircle;
  return Clock3;
}

export default function CustomersPage({ transactions = [] }) {
  const [search, setSearch] = useState("");
  const [customerType, setCustomerType] = useState("All");
  const [sortBy, setSortBy] = useState("spent");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState(null);

  const customers = useMemo(() => {
    const customerMap = new Map();

    transactions.forEach((transaction) => {
      const email = transaction.email?.trim().toLowerCase();

      if (!email) return;

      if (!customerMap.has(email)) {
        customerMap.set(email, {
          name: transaction.customer?.trim() || "Unknown Customer",
          email,
          orders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          failedOrders: 0,
          totalSpent: 0,
          lastOrder: transaction.date || "",
          transactions: [],
        });
      }

      const customer = customerMap.get(email);

      customer.orders += 1;
      customer.transactions.push(transaction);

      if (transaction.status === "Completed") {
        customer.completedOrders += 1;
        customer.totalSpent += Number(transaction.amount || 0);
      } else if (transaction.status === "Pending") {
        customer.pendingOrders += 1;
      } else if (transaction.status === "Failed") {
        customer.failedOrders += 1;
      }

      if (transaction.date && transaction.date > customer.lastOrder) {
        customer.lastOrder = transaction.date;
      }
    });

    return Array.from(customerMap.values()).map((customer) => ({
      ...customer,
      transactions: [...customer.transactions].sort((a, b) =>
        (b.date || "").localeCompare(a.date || "")
      ),
      type: customer.totalSpent >= 500 ? "VIP" : "Regular",
    }));
  }, [transactions]);

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

  const repeatCustomers = customers.filter(
    (customer) => customer.orders > 1
  ).length;

  const vipCustomers = customers.filter(
    (customer) => customer.type === "VIP"
  ).length;

  const selectedCustomer = customers.find(
    (customer) => customer.email === selectedCustomerEmail
  );

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers
      .filter((customer) => {
        const matchesSearch =
          customer.name.toLowerCase().includes(query) ||
          customer.email.includes(query);

        const matchesType =
          customerType === "All" || customer.type === customerType;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "orders") return b.orders - a.orders;
        if (sortBy === "recent") {
          return b.lastOrder.localeCompare(a.lastOrder);
        }
        return b.totalSpent - a.totalSpent;
      });
  }, [customers, search, customerType, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleCustomers = filteredCustomers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function updateSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function updateType(value) {
    setCustomerType(value);
    setCurrentPage(1);
  }

  function updateSort(value) {
    setSortBy(value);
    setCurrentPage(1);
  }

  return (
    <section className="customers-page">
      <header className="customers-header">
        <div>
          <div className="customers-eyebrow">
            <Users size={14} />
            CUSTOMER RELATIONSHIPS
          </div>

          <h1>Customers</h1>

          <p>
            Understand your audience, discover loyal buyers, and
            track customer activity.
          </p>
        </div>

        <div className="customers-header-badge">
          <span className="customers-live-dot" />
          Transaction data
        </div>
      </header>

      <div className="customers-stats-grid">
        <article className="customers-stat-card">
          <div className="customers-stat-top">
            <span className="customers-stat-icon customers-icon-blue">
              <Users size={20} />
            </span>
            <span className="customers-stat-caption">CUSTOMERS</span>
          </div>

          <h2>{customers.length.toLocaleString("en-US")}</h2>

          <div className="customers-stat-footer">
            <span>Unique customer emails</span>
            <UserRound size={15} />
          </div>
        </article>

        <article className="customers-stat-card">
          <div className="customers-stat-top">
            <span className="customers-stat-icon customers-icon-green">
              <Wallet size={20} />
            </span>
            <span className="customers-stat-caption">TOTAL SPENT</span>
          </div>

          <h2>{formatCurrency(totalRevenue)}</h2>

          <div className="customers-stat-footer">
            <span>Completed purchases only</span>
            <ArrowUpRight size={15} />
          </div>
        </article>

        <article className="customers-stat-card">
          <div className="customers-stat-top">
            <span className="customers-stat-icon customers-icon-purple">
              <Crown size={20} />
            </span>
            <span className="customers-stat-caption">VIP CUSTOMERS</span>
          </div>

          <h2>{vipCustomers.toLocaleString("en-US")}</h2>

          <div className="customers-stat-footer">
            <span>$500+ completed spending</span>
            <Crown size={15} />
          </div>
        </article>

        <article className="customers-stat-card">
          <div className="customers-stat-top">
            <span className="customers-stat-icon customers-icon-orange">
              <ShoppingCart size={20} />
            </span>
            <span className="customers-stat-caption">REPEAT BUYERS</span>
          </div>

          <h2>{repeatCustomers.toLocaleString("en-US")}</h2>

          <div className="customers-stat-footer">
            <span>More than one transaction</span>
            <ArrowDownRight size={15} />
          </div>
        </article>
      </div>

      <section className="customers-panel">
        <div className="customers-panel-heading">
          <div>
            <h2>Customer directory</h2>
            <p>Browse and review your customer relationships.</p>
          </div>

          <span className="customers-total-badge">
            {filteredCustomers.length} customers
          </span>
        </div>

        <div className="customers-toolbar">
          <div className="customers-search">
            <Search size={17} />

            <input
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search name or email..."
              aria-label="Search customers"
            />
          </div>

          <div className="customers-filter">
            <SlidersHorizontal size={16} />

            <select
              value={customerType}
              onChange={(event) => updateType(event.target.value)}
              aria-label="Filter customers by type"
            >
              <option value="All">All customers</option>
              <option value="VIP">VIP customers</option>
              <option value="Regular">Regular customers</option>
            </select>
          </div>

          <select
            className="customers-sort"
            value={sortBy}
            onChange={(event) => updateSort(event.target.value)}
            aria-label="Sort customers"
          >
            <option value="spent">Highest spending</option>
            <option value="orders">Most orders</option>
            <option value="recent">Most recent</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {visibleCustomers.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon">
              {search ? <Search size={25} /> : <UserRoundPlus size={25} />}
            </div>

            <h3>
              {search || customerType !== "All"
                ? "No matching customers"
                : "No customers yet"}
            </h3>

            <p>
              {search || customerType !== "All"
                ? "Try another search or change the customer filter."
                : "Add a transaction with a customer email to populate this directory."}
            </p>

            {(search || customerType !== "All") && (
              <button
                type="button"
                className="customers-reset-button"
                onClick={() => {
                  setSearch("");
                  setCustomerType("All");
                  setCurrentPage(1);
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="customers-table-wrap">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Customer type</th>
                    <th>Orders</th>
                    <th>Total spent</th>
                    <th>Last order</th>
                    <th>Details</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleCustomers.map((customer, index) => (
                    <tr key={customer.email}>
                      <td>
                        <div className="customers-identity">
                          <div
                            className={`customers-avatar customers-avatar-${index % 5}`}
                          >
                            {getInitials(customer.name)}
                          </div>

                          <div className="customers-identity-copy">
                            <strong>{customer.name}</strong>
                            <span>
                              <Mail size={12} />
                              {customer.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`customers-type-badge ${
                            customer.type === "VIP"
                              ? "customers-type-vip"
                              : "customers-type-regular"
                          }`}
                        >
                          {customer.type === "VIP" && <Crown size={12} />}
                          {customer.type}
                        </span>
                      </td>

                      <td>
                        <span className="customers-order-count">
                          {customer.orders}
                        </span>
                      </td>

                      <td>
                        <strong className="customers-spent">
                          {formatCurrency(customer.totalSpent)}
                        </strong>
                        <span className="customers-cell-subtitle">
                          {customer.completedOrders} completed
                        </span>
                      </td>

                      <td>
                        <span className="customers-last-order">
                          <CalendarDays size={14} />
                          {formatDate(customer.lastOrder)}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="customers-view-button"
                          onClick={() =>
                            setSelectedCustomerEmail(customer.email)
                          }
                          aria-label={`View ${customer.name} details`}
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="customers-mobile-list">
              {visibleCustomers.map((customer, index) => (
                <article
                  className="customers-mobile-card"
                  key={customer.email}
                >
                  <div className="customers-mobile-top">
                    <div className="customers-identity">
                      <div
                        className={`customers-avatar customers-avatar-${index % 5}`}
                      >
                        {getInitials(customer.name)}
                      </div>

                      <div className="customers-identity-copy">
                        <strong>{customer.name}</strong>
                        <span>{customer.email}</span>
                      </div>
                    </div>

                    <span
                      className={`customers-type-badge ${
                        customer.type === "VIP"
                          ? "customers-type-vip"
                          : "customers-type-regular"
                      }`}
                    >
                      {customer.type === "VIP" && <Crown size={12} />}
                      {customer.type}
                    </span>
                  </div>

                  <div className="customers-mobile-details">
                    <div>
                      <span>Spent</span>
                      <strong>{formatCurrency(customer.totalSpent)}</strong>
                    </div>

                    <div>
                      <span>Orders</span>
                      <strong>{customer.orders}</strong>
                    </div>

                    <div>
                      <span>Last order</span>
                      <strong>{formatDate(customer.lastOrder)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="customers-view-button customers-mobile-view"
                    onClick={() =>
                      setSelectedCustomerEmail(customer.email)
                    }
                  >
                    <Eye size={15} />
                    View customer details
                  </button>
                </article>
              ))}
            </div>

            <div className="customers-pagination">
              <span>
                Showing{" "}
                {filteredCustomers.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
                {"–"}
                {Math.min(safePage * PAGE_SIZE, filteredCustomers.length)}
                {" of "}
                {filteredCustomers.length} customers
              </span>

              <div className="customers-pagination-actions">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage(safePage - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                <span>
                  {safePage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage(safePage + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <footer className="customers-footer">
        <span>Nexus Analytics · Customer Management</span>
        <span>Based on recorded transactions</span>
      </footer>

      {selectedCustomer && (
        <div
          className="customer-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomerEmail(null);
            }
          }}
        >
          <section
            className="customer-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
          >
            <header className="customer-modal-header">
              <div>
                <span className="customer-modal-eyebrow">
                  <Users size={14} />
                  CUSTOMER PROFILE
                </span>
                <h2 id="customer-modal-title">Customer details</h2>
                <p>Customer overview and transaction history.</p>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={() => setSelectedCustomerEmail(null)}
                aria-label="Close customer details"
              >
                <X size={20} />
              </button>
            </header>

            <div className="customer-profile">
              <div className="customer-profile-avatar">
                {getInitials(selectedCustomer.name)}
              </div>

              <div className="customer-profile-info">
                <h3>{selectedCustomer.name}</h3>
                <span>
                  <Mail size={14} />
                  {selectedCustomer.email}
                </span>

                <span
                  className={`customers-type-badge ${
                    selectedCustomer.type === "VIP"
                      ? "customers-type-vip"
                      : "customers-type-regular"
                  }`}
                >
                  {selectedCustomer.type === "VIP" && <Crown size={12} />}
                  {selectedCustomer.type} customer
                </span>
              </div>
            </div>

            <div className="customer-detail-stats">
              <article>
                <span className="customer-detail-stat-icon">
                  <Wallet size={18} />
                </span>
                <span>Total spent</span>
                <strong>{formatCurrency(selectedCustomer.totalSpent)}</strong>
              </article>

              <article>
                <span className="customer-detail-stat-icon">
                  <ShoppingCart size={18} />
                </span>
                <span>Total orders</span>
                <strong>{selectedCustomer.orders}</strong>
              </article>

              <article>
                <span className="customer-detail-stat-icon">
                  <CheckCircle2 size={18} />
                </span>
                <span>Completed</span>
                <strong>{selectedCustomer.completedOrders}</strong>
              </article>
            </div>

            <div className="customer-detail-extra">
              <div>
                <CalendarDays size={16} />
                <span>Last order</span>
                <strong>{formatDate(selectedCustomer.lastOrder)}</strong>
              </div>

              <div>
                <Crown size={16} />
                <span>Customer level</span>
                <strong>{selectedCustomer.type}</strong>
              </div>
            </div>

            <div className="customer-history-heading">
              <div>
                <h3>Transaction history</h3>
                <p>Recent activity for this customer</p>
              </div>

              <span>{selectedCustomer.transactions.length} records</span>
            </div>

            {selectedCustomer.transactions.length === 0 ? (
              <div className="customer-history-empty">
                No transactions found for this customer.
              </div>
            ) : (
              <div className="customer-history-list">
                {selectedCustomer.transactions.map((transaction, index) => {
                  const StatusIcon = getStatusIcon(transaction.status);

                  return (
                    <article
                      className="customer-history-item"
                      key={transaction.id ?? `${transaction.date}-${index}`}
                    >
                      <div className="customer-history-icon">
                        <Hash size={17} />
                      </div>

                      <div className="customer-history-main">
                        <strong>
                          {transaction.id || `Transaction ${index + 1}`}
                        </strong>
                        <span>
                          {formatDate(transaction.date)}
                        </span>
                      </div>

                      <div className="customer-history-amount">
                        <strong>
                          {formatCurrency(transaction.amount)}
                        </strong>

                        <span
                          className={`customer-history-status ${
                            transaction.status === "Completed"
                              ? "history-status-completed"
                              : transaction.status === "Failed"
                              ? "history-status-failed"
                              : "history-status-pending"
                          }`}
                        >
                          <StatusIcon size={12} />
                          {transaction.status || "Pending"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <footer className="customer-modal-footer">
              <span>
                {selectedCustomer.pendingOrders} pending ·{" "}
                {selectedCustomer.failedOrders} failed
              </span>

              <button
                type="button"
                onClick={() => setSelectedCustomerEmail(null)}
              >
                Close details
              </button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}