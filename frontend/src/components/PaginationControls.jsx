// import React, { useCallback } from "react";

// function PaginationControls({ pagination, onPageChange }) {
//   if (!pagination) return null;

//   const goPrev = useCallback(() => {
//     onPageChange(pagination.page - 1);
//   }, [pagination.page, onPageChange]);

//   const goNext = useCallback(() => {
//     onPageChange(pagination.page + 1);
//   }, [pagination.page, onPageChange]);

//   return (
//     <div className="pagination">
//       <button disabled={pagination.page === 1} onClick={goPrev}>
//         Prev
//       </button>

//       <span>
//         Page {pagination.page} of {pagination.totalPages}
//       </span>

//       <button
//         disabled={pagination.page === pagination.totalPages}
//         onClick={goNext}
//       >
//         Next
//       </button>
//     </div>
//   );
// }

// export default React.memo(PaginationControls);






// src/components/PaginationControls.jsx
import React from "react";

export default function PaginationControls({ pagination, onPageChange }) {
  if (!pagination) return null;

  const { page, totalPages } = pagination;

  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        className="px-4 py-2 rounded-md border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <span className="text-sm text-slate-600">
        Page{" "}
        <span className="font-semibold text-slate-800">{page}</span> of{" "}
        <span className="font-semibold text-slate-800">
          {totalPages.toLocaleString("en-IN")}
        </span>
      </span>

      <button
        className="px-4 py-2 rounded-md border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
