// import React, { useCallback } from "react";

// const REGION = ["North", "South", "East", "West"];
// const GENDER = ["Male", "Female", "Other"];

// function FiltersPanel({ filters, onChange }) {
  
//   const updateField = useCallback((key, value) => {
//     onChange(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   }, [onChange]);

//   return (
//     <div className="filters">

//       <div className="card">
//         <label>Region</label>
//         <select
//           multiple
//           value={filters.region}
//           onChange={(e) =>
//             updateField(
//               "region",
//               Array.from(e.target.selectedOptions).map((o) => o.value)
//             )
//           }
//         >
//           {REGION.map((r) => (
//             <option key={r}>{r}</option>
//           ))}
//         </select>
//       </div>

//       <div className="card">
//         <label>Gender</label>
//         <select
//           multiple
//           value={filters.gender}
//           onChange={(e) =>
//             updateField(
//               "gender",
//               Array.from(e.target.selectedOptions).map((o) => o.value)
//             )
//           }
//         >
//           {GENDER.map((g) => (
//             <option key={g}>{g}</option>
//           ))}
//         </select>
//       </div>

//       <div className="card two-col">
//         <div>
//           <label>Age Min</label>
//           <input
//             type="number"
//             value={filters.ageMin}
//             onChange={(e) => updateField("ageMin", e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Age Max</label>
//           <input
//             type="number"
//             value={filters.ageMax}
//             onChange={(e) => updateField("ageMax", e.target.value)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default React.memo(FiltersPanel);








// src/components/FiltersPanel.jsx
import React from "react";

const REGION = ["North", "South", "East", "West"];
const GENDER = ["Male", "Female", "Other"];
const AGE_RANGES = [
  { label: "All ages", value: "" },
  { label: "18 - 25", value: "18-25" },
  { label: "26 - 35", value: "26-35" },
  { label: "36 - 50", value: "36-50" },
  { label: "50+", value: "50-120" },
];
const PRODUCT_CATEGORY = [
  "Electronics",
  "Groceries",
  "Clothing",
  "Home & Kitchen",
];
const PAYMENT = ["Cash", "Card", "UPI", "Wallet"];

export default function FiltersPanel({
  filters,
  onChange,
  sort,
  onSortChange,
  stats,
}) {
  const safeFilters = filters || {};
  const safeSort = sort || { sortBy: "date", sortOrder: "desc" };

  const updateField = (key, value) => {
    onChange({ ...safeFilters, [key]: value });
  };

  const handleAgeRangeChange = (value) => {
    if (!value) {
      updateField("ageMin", "");
      updateField("ageMax", "");
      return;
    }
    const [min, max] = value.split("-");
    updateField("ageMin", min);
    updateField("ageMax", max);
  };

  const currentAgeRange = (() => {
    const min = safeFilters.ageMin || "";
    const max = safeFilters.ageMax || "";
    if (!min || !max) return "";
    return `${min}-${max}`;
  })();

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-5 p-4 border border-red-500">
        {/* Reset button */}
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium bg-white border border-2 border-red-500 rounded-lg border-slate-300 text-slate-600 hover:bg-slate-100"
          onClick={() =>
            onChange({
              region: [],
              gender: [],
              ageMin: "",
              ageMax: "",
              productCategory: [],
              tags: [],
              paymentMethod: [],
              dateFrom: "",
              dateTo: "",
            })
          }
        >
          ⟳
         
        </button>

        <FilterSelect
          label="Customer Region"
          value={safeFilters.region?.[0] || ""}
          onChange={(val) =>
            updateField("region", val ? [val] : [])
          }
          options={REGION}
        />

        <FilterSelect
          label="Gender"
          value={safeFilters.gender?.[0] || ""}
          onChange={(val) =>
            updateField("gender", val ? [val] : [])
          }
          options={GENDER}
        />

        <FilterSelect
          label="Age Range"
          value={currentAgeRange}
          onChange={handleAgeRangeChange}
          options={AGE_RANGES.map((r) => r.label)}
          mapLabelToValue={(label) =>
            AGE_RANGES.find((r) => r.label === label)?.value || ""
          }
        />

        <FilterSelect
          label="Product Category"
          value={safeFilters.productCategory?.[0] || ""}
          onChange={(val) =>
            updateField("productCategory", val ? [val] : [])
          }
          options={PRODUCT_CATEGORY}
        />

        <FilterSelect
          label="Payment Method"
          value={safeFilters.paymentMethod?.[0] || ""}
          onChange={(val) =>
            updateField("paymentMethod", val ? [val] : [])
          }
          options={PAYMENT}
        />

        {/* Date placeholder (not wired deeply, but UI matches) */}
        <FilterSelect
          label="Date"
          value={safeFilters.dateFrom || ""}
          onChange={(val) => updateField("dateFrom", val)}
          options={["All", "Last 7 days", "Last 30 days", "This year"]}
        />

        {/* Sort by */}
        <FilterSelect
          label="Sort by"
          value={`${safeSort.sortBy}-${safeSort.sortOrder}`}
          onChange={(val) => {
            const [sortBy, sortOrder] = val.split("-");
            onSortChange({ sortBy, sortOrder });
          }}
          options={[
            { label: "Customer Name (A-Z)", value: "customer_name-asc" },
            { label: "Customer Name (Z-A)", value: "customer_name-desc" },
            { label: "Date (Newest first)", value: "date-desc" },
            { label: "Date (Oldest first)", value: "date-asc" },
          ]}
          custom
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total units sold"
          value={stats.totalUnits.toLocaleString("en-IN")}
        />
        <StatCard
          title="Total Amount"
          value={`₹${stats.totalAmount.toLocaleString("en-IN")}`}
          subtitle={`${stats.recordsCount} SRs`}
        />
        <StatCard
          title="Total Discount"
          value={`₹${stats.totalDiscount.toLocaleString("en-IN")}`}
          subtitle={`${stats.discountSrs} SRs`}
        />
      </div>
    </div>
  );
}

/* Helper components */

function FilterSelect({
  label,
  value,
  onChange,
  options,
  mapLabelToValue,
  custom = false,
}) {
  const normalizedOptions = custom
    ? options
    : options.map((o) => ({ label: o, value: o }));

  const handleChange = (e) => {
    const val = e.target.value;
    if (mapLabelToValue) {
      const mapped = mapLabelToValue(val);
      onChange(mapped);
    } else {
      onChange(val);
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <label className="text-[11px] font-medium text-slate-500">
        {label}
      </label>
      <select
        className="min-w-[140px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={value}
        onChange={handleChange}
      >
        <option value="">All</option>
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="px-4 py-3 bg-white border shadow-sm rounded-xl border-slate-200">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
          {title}
          <span className="text-[10px] text-slate-400 border border-slate-300 rounded-full w-4 h-4 flex items-center justify-center">
            i
          </span>
        </p>
      </div>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
