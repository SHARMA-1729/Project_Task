import React from "react";

export default function PaginationControls({ pagination, onPageChange }) {
  if (!pagination) return null;

  return (
    <div className="pagination-bar">
      <button
        className="pagination-btn"
        disabled={pagination.page === 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Prev
      </button>

      <span className="pagination-info">
        Page {pagination.page} of {pagination.totalPages}
      </span>

      <button
        className="pagination-btn"
        disabled={pagination.page === pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
}
