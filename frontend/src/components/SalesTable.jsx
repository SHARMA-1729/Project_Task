// import React, { useMemo } from "react";

// function SalesTable({ rows }) {

//   if (!rows || rows.length === 0) return <p>No records found.</p>;

//   const processedRows = useMemo(() => {
//     return rows.map(r => ({
//       ...r,
//       dateFormatted: new Date(r.date).toLocaleDateString()
//     }));
//   }, [rows]);

//   return (
//     <table className="sales-table">
//       <thead>
//         <tr>
//           <th>Date</th>
//           <th>Customer</th>
//           <th>Phone</th>
//           <th>Region</th>
//           <th>Product</th>
//           <th>Qty</th>
//           <th>Final Amount</th>
//         </tr>
//       </thead>
//       <tbody>
//         {processedRows.map((r) => (
//           <tr key={r.id}>
//             <td>{r.dateFormatted}</td>
//             <td>{r.customer_name}</td>
//             <td>{r.phone_number}</td>
//             <td>{r.customer_region}</td>
//             <td>{r.product_name}</td>
//             <td>{r.quantity}</td>
//             <td>{r.final_amount}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default React.memo(SalesTable);










// src/components/SalesTable.jsx
import React from "react";

export default function SalesTable({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="py-10 text-sm text-center text-slate-500">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-red-500">
      <table className="min-w-full text-sm border-2 border-separate border-red-500 border-spacing-0">
        <thead>
          <tr className="text-xs font-semibold bg-slate-50 text-slate-500">
            {[
              "Transaction ID",
              "Date",
              "Customer ID",
              "Customer name",
              "Phone Number",
              "Gender",
              "Age",
              "Product Category",
              "Quantity",
              "Total Amount",
              "Customer region",
              "Product ID",
              "Employee name",
            ].map((col, idx, arr) => (
              <th
                key={col}
                className={`border-b border-slate-200 px-4 py-2 text-left ${
                  idx === 0 ? "rounded-tl-xl" : ""
                } ${idx === arr.length - 1 ? "rounded-tr-xl" : ""}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, rowIdx) => (
            <tr
              key={r.id || `${r.order_id}-${rowIdx}`}
              className="odd:bg-white even:bg-slate-50/60 hover:bg-indigo-50/60"
            >
              <Cell>{r.transaction_id || r.order_id || "1234567"}</Cell>
              <Cell>
                {r.date
                  ? new Date(r.date).toISOString().slice(0, 10)
                  : ""}
              </Cell>
              <Cell>{r.customer_id}</Cell>
              <Cell>{r.customer_name}</Cell>
              <Cell className="font-medium text-indigo-600">
                {r.phone_number}
              </Cell>
              <Cell>{r.gender}</Cell>
              <Cell>{r.age}</Cell>
              <Cell>{r.product_category}</Cell>
              <Cell className="text-right">
                {r.quantity?.toString().padStart(2, "0")}
              </Cell>
              <Cell className="text-right">
                ₹{Number(r.total_amount || r.final_amount || 0).toLocaleString(
                  "en-IN"
                )}
              </Cell>
              <Cell>{r.customer_region}</Cell>
              <Cell>{r.product_id}</Cell>
              <Cell>{r.employee_name}</Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ children, className = "" }) {
  return (
    <td className={`border-b border-slate-200 px-4 py-2 ${className}`}>
      {children}
    </td>
  );
}
