
import {
  Search,
  Plus,
  Download,
  Pencil,
  Trash2,
} from "lucide-react";

function TransactionsTable({
  transactions,
  filteredTransactions,
  sortedTransactions,
  paginatedTransactions,
  transactionSearch,
  setTransactionSearch,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  sortConfig,
  handleSort,
  handleAddTransaction,
  handleEditTransaction,
  handleDeleteTransaction,
  exportTransactionsToCSV,
  formatCurrency,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(sortedTransactions.length / rowsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;

  const firstTransaction =
    sortedTransactions.length === 0 ? 0 : startIndex + 1;

  const lastTransaction = Math.min(
    startIndex + rowsPerPage,
    sortedTransactions.length
  );

  return (
    <section className="transactions-section">
      <div className="transactions-header">
        <div>
          <h2>Recent Transactions</h2>
          <p>Track and manage your latest transactions.</p>
        </div>

        <div className="transaction-header-actions">
          <button
            type="button"
            className="add-transaction-btn export-btn"
            onClick={exportTransactionsToCSV}
          >
            <Download size={18} />
            Export CSV
          </button>

          <button
            type="button"
            className="add-transaction-btn"
            onClick={handleAddTransaction}
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="transaction-controls">
        <label className="transaction-search">
          <Search size={17} />

          <input
            type="search"
            value={transactionSearch}
            onChange={(event) => {
              setTransactionSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search ID, customer, email..."
          />
        </label>

        <label className="transaction-filter">
          <span>Status:</span>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </label>
      </div>

      <div className="transactions-table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>

              {[
                ["customer", "Customer"],
                ["date", "Date"],
                ["amount", "Amount"],
                ["method", "Payment Method"],
                ["status", "Status"],
              ].map(([key, label]) => (
                <th key={key}>
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    {sortConfig.key === key &&
                      (sortConfig.direction === "ascending"
                        ? " ↑"
                        : " ↓")}
                  </button>
                </th>
              ))}

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-transactions">
                  No transactions found. Try changing your search or
                  filter.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="transaction-id">
                    {transaction.id}
                  </td>

                  <td>
                    <div className="customer-cell">
                      <span>{transaction.customer}</span>
                      <small>{transaction.email}</small>
                    </div>
                  </td>

                  <td>{transaction.date}</td>

                  <td>
                    {formatCurrency(Number(transaction.amount))}
                  </td>

                  <td>{transaction.method}</td>

                  <td>
                    <span
                      className={`transaction-status ${transaction.status.toLowerCase()}`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="edit-transaction-btn"
                        onClick={() =>
                          handleEditTransaction(transaction)
                        }
                        aria-label={`Edit transaction ${transaction.id}`}
                        title="Edit transaction"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="delete-transaction-btn"
                        onClick={() =>
                          handleDeleteTransaction(transaction.id)
                        }
                        aria-label={`Delete transaction ${transaction.id}`}
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          Showing <strong>{firstTransaction}</strong>–
          <strong>{lastTransaction}</strong> of{" "}
          <strong>{sortedTransactions.length}</strong> transactions
        </div>

        <div className="pagination-controls">
          <label htmlFor="rows-per-page">Rows:</label>

          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>

          <button
            type="button"
            className="pagination-btn"
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>

          <span className="pagination-page">
            Page {safeCurrentPage} of {totalPages}
          </span>

          <button
            type="button"
            className="pagination-btn"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1)
              )
            }
            disabled={safeCurrentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <div className="transactions-footer">
        Showing {filteredTransactions.length} of {transactions.length}{" "}
        transactions
      </div>
    </section>
  );
}

export default TransactionsTable;
