import React, { useRef } from "react";

const REGION = ["North", "South", "East", "West"];
const GENDER = ["Male", "Female", "Other"];
const AGE_RANGES = ["", "18-25", "26-35", "36-45", "46+"];
const PRODUCT_CATEGORIES = [
  "Clothing",
  "Electronics",
  "Furniture",
  "Accessories",
  "Beauty",
];
const TAGS = ["New", "Sale", "Bestseller", "Limited", "Seasonal"];
const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Net Banking", "Wallet"];
const SORT_OPTIONS = [
  { label: "Date (Newest First)", sortBy: "date", sortOrder: "desc" },
  { label: "Quantity", sortBy: "quantity", sortOrder: "desc" },
  { label: "Customer Name (A-Z)", sortBy: "customer_name", sortOrder: "asc" },
];

const FilterChip = ({ children, className = "", interactive = false }) => (
  <div
    className={`filter-chip ${interactive ? "filter-chip--interactive" : ""} ${className}`
      .trim()
      .replace(/\s+/g, " ")}
  >
    {children}
  </div>
);

const DateRangeField = ({ dateFrom, dateTo, onChange }) => {
  const startRef = useRef(null);
  const endRef = useRef(null);

  const openPicker = (ref) => {
    if (!ref.current) return;
    if (typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    } else {
      ref.current.focus();
      ref.current.click();
    }
  };

  const updateField = (field, value) => {
    const nextRange = {
      dateFrom,
      dateTo,
      [field]: value,
    };

    if (nextRange.dateFrom && nextRange.dateTo) {
      const startDate = new Date(nextRange.dateFrom);
      const endDate = new Date(nextRange.dateTo);
      if (startDate > endDate) {
        if (field === "dateFrom") {
          nextRange.dateTo = value;
        } else {
          nextRange.dateFrom = value;
        }
      }
    }

    onChange(nextRange);
  };

  return (
    <FilterChip className="filter-chip--date-range">
      <span className="date-chip-label">Date</span>
      <div className="date-range-box">
        <div className="date-input-wrapper">
          <div className="date-input-shell">
            <input
              ref={startRef}
              type="date"
              value={dateFrom || ""}
              onChange={(e) => updateField("dateFrom", e.target.value)}
              aria-label="Start date"
              title="Start date"
            />
            <button
              type="button"
              className="date-input-arrow"
              onClick={() => openPicker(startRef)}
              aria-label="Open start date picker"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          </div>
        </div>
        <span className="date-range-divider" aria-hidden="true">
          —
        </span>
        <div className="date-input-wrapper">
          <div className="date-input-shell">
            <input
              ref={endRef}
              type="date"
              value={dateTo || ""}
              onChange={(e) => updateField("dateTo", e.target.value)}
              aria-label="End date"
              title="End date"
            />
            <button
              type="button"
              className="date-input-arrow"
              onClick={() => openPicker(endRef)}
              aria-label="Open end date picker"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </FilterChip>
  );
};

export default function FiltersPanel({ filters, sort, onChange, onSortChange, onReset }) {
  const updateField = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const selectClass = (value) =>
    value ? "filter-chip-select" : "filter-chip-select filter-chip-select--placeholder";

  return (
    <div className="filters-inline">
      <button
        type="button"
        className="filter-reset"
        onClick={onReset}
        aria-label="Reset filters"
      >
        ↻
      </button>

      <FilterChip interactive>
        <select
          className={selectClass(filters.region)}
          value={filters.region}
          onChange={(e) => updateField("region", e.target.value)}
        >
          <option value="">Customer Region</option>
          {REGION.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </FilterChip>

      <FilterChip interactive>
        <select
          className={selectClass(filters.gender)}
          value={filters.gender}
          onChange={(e) => updateField("gender", e.target.value)}
        >
          <option value="">Gender</option>
          {GENDER.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </FilterChip>

      <FilterChip interactive>
        <select
          className={selectClass(filters.age)}
          value={filters.age}
          onChange={(e) => updateField("age", e.target.value)}
        >
          <option value="">Age Range</option>
          {AGE_RANGES.filter(Boolean).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </FilterChip>

      <FilterChip interactive>
        <select
          className={selectClass(filters.productCategory)}
          value={filters.productCategory}
          onChange={(e) => updateField("productCategory", e.target.value)}
        >
          <option value="">Product Category</option>
          {PRODUCT_CATEGORIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </FilterChip>

      <FilterChip interactive>
        <select
          className={selectClass(filters.tags)}
          value={filters.tags}
          onChange={(e) => updateField("tags", e.target.value)}
        >
          <option value="">Tags</option>
          {TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </FilterChip>

      <FilterChip interactive>
        <select
          className={selectClass(filters.paymentMethod)}
          value={filters.paymentMethod}
          onChange={(e) => updateField("paymentMethod", e.target.value)}
        >
          <option value="">Payment Method</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </FilterChip>

      <DateRangeField
     
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onChange={(range) => onChange({ ...filters, ...range })}
      />

      <FilterChip className="filter-chip--sort">
        <span className="sort-prefix">Sort by:</span>
        <select
          className="filter-chip-select sort-select"
          value={`${sort.sortBy}:${sort.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":");
            onSortChange({ sortBy, sortOrder });
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option
              key={`${option.sortBy}-${option.sortOrder}`}
              value={`${option.sortBy}:${option.sortOrder}`}
            >
              {option.label}
            </option>
          ))}
        </select>
      </FilterChip>
    </div>
  );
}
