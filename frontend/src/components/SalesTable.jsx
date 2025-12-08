import React from "react";

export default function SalesTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <p className="info-text">No records found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="sales-table">
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Customer ID</th>
          <th>Customer name</th>
          <th>Phone Number</th>
          <th>Gender</th>
          <th>Age</th>
          <th>Product Category</th>
          <th>Quantity</th>
          <th>Total Amount</th>
          <th>Customer region</th>
          <th>Product ID</th>
          <th>Employee name</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{new Date(r.date).toLocaleDateString()}</td>
            <td>{r.customer_id}</td>
            <td>{r.customer_name}</td>
            <td>{r.phone_number}</td>
            <td>{r.gender}</td>
            <td>{r.age}</td>
            <td>{r.product_category}</td>
            <td>{r.quantity}</td>
            <td>{r.final_amount}</td>
            <td>{r.customer_region}</td>
            <td>{r.product_id}</td>
            <td>{r.employee_name}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}
