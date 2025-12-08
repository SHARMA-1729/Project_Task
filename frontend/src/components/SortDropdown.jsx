import React from "react";

const SORT_OPTIONS = [
  { label: "Date (Newest First)", sortBy: "date", sortOrder: "desc" },
  { label: "Date (Oldest First)", sortBy: "date", sortOrder: "asc" },
  { label: "Quantity (High → Low)", sortBy: "quantity", sortOrder: "desc" },
  { label: "Quantity (Low → High)", sortBy: "quantity", sortOrder: "asc" },
  { label: "Customer Name (A-Z)", sortBy: "customer_name", sortOrder: "asc" },
  { label: "Customer Name (Z-A)", sortBy: "customer_name", sortOrder: "desc" },
];

export default function SortDropdown({ sort, onChange }) {
  const value = `${sort.sortBy}:${sort.sortOrder}`;

  const handleChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(":");
    onChange({ sortBy, sortOrder });
  };

  return (
    <div className="sortbox">
      <span className="sortbox-label">Sort by</span>
      <select className="sortbox-select" value={value} onChange={handleChange}>
        {SORT_OPTIONS.map((option) => (
          <option
            key={`${option.sortBy}-${option.sortOrder}`}
            value={`${option.sortBy}:${option.sortOrder}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
