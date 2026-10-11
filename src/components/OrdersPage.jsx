
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  Package,
  CreditCard,
  CalendarDays,
  RotateCcw,
  Eye,
  X,
  UserRound,
  Mail,
  Hash,
  ArrowUpDown,
} from "lucide-react";

function OrdersPage({ transactions = [], onUpdateStatus }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [nextStatus, setNextStatus] = useState("");

  const formatCurrency = (amount) =>
    `$${Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getInitials = (name) =>
    String(name || "Customer")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const completedOrders = transactions.filter(
    (order) => order.status === "Completed"
  );

  const pendingOrders = transactions.filter(
    (order) => order.status === "Pending"
  );

  const failedOrders = transactions.filter(
    (order) => order.status === "Failed"
  );

  const completedRevenue = completedOrders.reduce(
    (total, order) => total + Number(order.amount || 0),
    0
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions
      .filter((order) => {
        const searchableValues = [
          order.id,
          order.customer,
          order.email,
          order.method,
        ];

        const matchesSearch = searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

        const matchesStatus =
          statusFilter === "All" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return String(b.date || "").localeCompare(String(a.date || ""));
        }

        if (sortOrder === "oldest") {
          return String(a.date || "").localeCompare(String(b.date || ""));
        }

        if (sortOrder === "highest") {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }

        return Number(a.amount || 0) - Number(b.amount || 0);
      });
  }, [transactions, search, statusFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const displayedOrders = filteredOrders.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const selectedOrder =
    transactions.find((order) => order.id === selectedOrderId) || null;

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setSortOrder("newest");
    setCurrentPage(1);
  }

  function openDetails(order) {
    setSelectedOrderId(order.id);
    setNextStatus(order.status);
  }

  function closeDetails() {
    setSelectedOrderId(null);
    setNextStatus("");
  }

  function handleStatusUpdate() {
    if (
      !selectedOrder ||
      !onUpdateStatus ||
      nextStatus === selectedOrder.status
    ) {
      return;
    }

    onUpdateStatus(selectedOrder.id, nextStatus);
  }

  function renderStatusIcon(status) {
    if (status === "Completed") return <CheckCircle2 size={13} />;
    if (status === "Pending") return <Clock3 size={13} />;
    return <XCircle size={13} />;
  }

  function renderStatus(status) {
    const normalizedStatus = String(status || "Unknown")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return (
      <span
        className={`orders-status orders-status-${normalizedStatus}`}
      >
        {renderStatusIcon(status)}
        {status || "Unknown"}
      </span>
    );
  }

  return (
    <section className="orders-page">
      <header className="orders-header">
        <div>
          <div className="orders-eyebrow">
            <span className="orders-live-dot" />
            ORDER MANAGEMENT
          </div>

          <h1>Orders</h1>

          <p>
            Track orders, monitor payments, and manage your business
            transactions in one place.
          </p>
        </div>

        <div className="orders-header-badge">
          <Package size={17} />
          <span>{transactions.length} Total Orders</span>
        </div>
      </header>

      <div className="orders-stats-grid">
        <article className="orders-stat-card">
          <div className="orders-stat-top">
            <div className="orders-stat-icon orders-stat-blue">
              <ShoppingCart size={20} />
            </div>
            <span className="orders-stat-label">Total Orders</span>
          </div>
          <h2>{transactions.length.toLocaleString("en-US")}</h2>
          <p>All recorded orders</p>
        </article>

        <article className="orders-stat-card">
          <div className="orders-stat-top">
            <div className="orders-stat-icon orders-stat-green">
              <DollarSign size={20} />
            </div>
            <span className="orders-stat-label">Completed Revenue</span>
          </div>
          <h2>{formatCurrency(completedRevenue)}</h2>
          <p>Revenue from completed orders</p>
        </article>

        <article className="orders-stat-card">
          <div className="orders-stat-top">
            <div className="orders-stat-icon orders-stat-orange">
              <Clock3 size={20} />
            </div>
            <span className="orders-stat-label">Pending Orders</span>
          </div>
          <h2>{pendingOrders.length.toLocaleString("en-US")}</h2>
          <p>Awaiting completion</p>
        </article>

        <article className="orders-stat-card">
          <div className="orders-stat-top">
            <div className="orders-stat-icon orders-stat-purple">
              <CheckCircle2 size={20} />
            </div>
            <span className="orders-stat-label">Completed Orders</span>
          </div>
          <h2>{completedOrders.length.toLocaleString("en-US")}</h2>
          <p>
            {failedOrders.length} failed{" "}
            {failedOrders.length === 1 ? "order" : "orders"}
          </p>
        </article>
      </div>

      <div className="orders-panel">
        <div className="orders-panel-heading">
          <div>
            <h2>All Orders</h2>
            <p>Search, filter, and review your latest orders.</p>
          </div>

          <span className="orders-results-badge">
            {filteredOrders.length} results
          </span>
        </div>

        <div className="orders-toolbar">
          <div className="orders-search">
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search ID, customer, email..."
              aria-label="Search orders"
            />
          </div>

          <select
            className="orders-select"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by order status"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            className="orders-select"
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Sort orders"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>

          <button
            type="button"
            className="orders-reset-button"
            onClick={resetFilters}
            title="Reset filters"
            aria-label="Reset filters"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {displayedOrders.length > 0 ? (
          <>
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedOrders.map((order, index) => (
                    <tr key={order.id}>
                      <td>
                        <span className="orders-id">{order.id}</span>
                      </td>

                      <td>
                        <div className="orders-customer">
                          <div
                            className={`orders-avatar orders-avatar-${index % 5}`}
                          >
                            {getInitials(order.customer)}
                          </div>

                          <div className="orders-customer-info">
                            <strong>{order.customer || "Unknown customer"}</strong>
                            <span>{order.email || "No email provided"}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="orders-date">
                          <CalendarDays size={14} />
                          {formatDate(order.date)}
                        </div>
                      </td>

                      <td>
                        <div className="orders-payment">
                          <CreditCard size={15} />
                          {order.method || "—"}
                        </div>
                      </td>

                      <td>
                        <strong className="orders-amount">
                          {formatCurrency(order.amount)}
                        </strong>
                      </td>

                      <td>{renderStatus(order.status)}</td>

                      <td>
                        <button
                          type="button"
                          className="orders-view-button"
                          onClick={() => openDetails(order)}
                          aria-label={`View order ${order.id}`}
                          title="View order details"
                        >
                          <Eye size={16} />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="orders-mobile-list">
              {displayedOrders.map((order, index) => (
                <article className="orders-mobile-card" key={order.id}>
                  <div className="orders-mobile-top">
                    <div className="orders-customer">
                      <div
                        className={`orders-avatar orders-avatar-${index % 5}`}
                      >
                        {getInitials(order.customer)}
                      </div>

                      <div className="orders-customer-info">
                        <strong>{order.customer || "Unknown customer"}</strong>
                        <span>{order.id}</span>
                      </div>
                    </div>

                    {renderStatus(order.status)}
                  </div>

                  <div className="orders-mobile-details">
                    <div>
                      <span>Amount</span>
                      <strong className="orders-amount">
                        {formatCurrency(order.amount)}
                      </strong>
                    </div>

                    <div>
                      <span>Date</span>
                      <strong>{formatDate(order.date)}</strong>
                    </div>

                    <div>
                      <span>Payment</span>
                      <strong>{order.method || "—"}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{order.email || "—"}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="orders-view-button orders-mobile-view-button"
                    onClick={() => openDetails(order)}
                  >
                    <Eye size={16} />
                    View Order Details
                  </button>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <ShoppingCart size={25} />
            </div>
            <h3>No orders found</h3>
            <p>
              Try changing your search or filters to find the orders
              you are looking for.
            </p>
            <button
              type="button"
              className="orders-reset-empty"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          </div>
        )}

        <div className="orders-pagination">
          <div className="orders-page-size">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              aria-label="Rows per page"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
            </select>
          </div>

          <span className="orders-page-count">
            {filteredOrders.length === 0
              ? "0 orders"
              : `${(safePage - 1) * rowsPerPage + 1}–${Math.min(
                  safePage * rowsPerPage,
                  filteredOrders.length
                )} of ${filteredOrders.length}`}
          </span>

          <div className="orders-page-actions">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage === 1}
              aria-label="First page"
            >
              «
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              ‹
            </button>

            <span>
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              ›
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage === totalPages}
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </div>
      </div>

      <footer className="orders-footer">
        <span>Order management overview</span>
        <span>
          {completedOrders.length} completed · {pendingOrders.length} pending ·{" "}
          {failedOrders.length} failed
        </span>
      </footer>

      {selectedOrder && (
        <div
          className="orders-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
        >
          <section
            className="orders-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="orders-detail-title"
          >
            <div className="orders-modal-header">
              <div>
                <span className="orders-modal-eyebrow">ORDER DETAILS</span>
                <h2 id="orders-detail-title">{selectedOrder.id}</h2>
                <p>Review customer, payment, and order status.</p>
              </div>

              <button
                type="button"
                className="orders-modal-close"
                onClick={closeDetails}
                aria-label="Close order details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="orders-detail-amount">
              <span>Order amount</span>
              <strong>{formatCurrency(selectedOrder.amount)}</strong>
              {renderStatus(selectedOrder.status)}
            </div>

            <div className="orders-detail-grid">
              <div className="orders-detail-item">
                <UserRound size={17} />
                <div>
                  <span>Customer</span>
                  <strong>{selectedOrder.customer || "—"}</strong>
                </div>
              </div>

              <div className="orders-detail-item">
                <Mail size={17} />
                <div>
                  <span>Email address</span>
                  <strong>{selectedOrder.email || "—"}</strong>
                </div>
              </div>

              <div className="orders-detail-item">
                <CalendarDays size={17} />
                <div>
                  <span>Order date</span>
                  <strong>{formatDate(selectedOrder.date)}</strong>
                </div>
              </div>

              <div className="orders-detail-item">
                <CreditCard size={17} />
                <div>
                  <span>Payment method</span>
                  <strong>{selectedOrder.method || "—"}</strong>
                </div>
              </div>

              <div className="orders-detail-item">
                <Hash size={17} />
                <div>
                  <span>Order reference</span>
                  <strong>{selectedOrder.id}</strong>
                </div>
              </div>
            </div>

            <div className="orders-status-editor">
              <label htmlFor="orders-next-status">Update order status</label>

              <select
                id="orders-next-status"
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value)}
                disabled={!onUpdateStatus}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>

              {!onUpdateStatus && (
                <p>Status editing will be enabled in the next integration step.</p>
              )}
            </div>

            <div className="orders-modal-actions">
              <button
                type="button"
                className="orders-modal-cancel"
                onClick={closeDetails}
              >
                Close
              </button>

              <button
                type="button"
                className="orders-modal-save"
                onClick={handleStatusUpdate}
                disabled={
                  !onUpdateStatus || nextStatus === selectedOrder.status
                }
              >
                Save Status
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default OrdersPage;
