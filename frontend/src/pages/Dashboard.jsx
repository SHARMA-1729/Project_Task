import React, { useState, useMemo } from "react";
import SearchBar from "../components/SearchBar.jsx";
import FiltersPanel from "../components/FiltersPanel.jsx";
import SalesTable from "../components/SalesTable.jsx";
import PaginationControls from "../components/PaginationControls.jsx";
import useSalesData from "../hooks/useSalesData.js";

const DEFAULT_FILTERS = {
  region: "",
  gender: "",
  age: "",
  productCategory: "",
  tags: "",
  paymentMethod: "",
  dateFrom: "",
  dateTo: "",
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [sort, setSort] = useState({ sortBy: "date", sortOrder: "desc" });
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const { data, pagination, loading, error } = useSalesData({
    search,
    filters,
    sort,
    page,
  });

  const stats = useMemo(() => {
    if (!data || data.length === 0)
      return { units: 0, totalAmount: 0, totalDiscount: 0 };

    let units = 0;
    let totalAmount = 0;
    let totalDiscount = 0;

    data.forEach((row) => {
      const q = Number(row.quantity || 0);
      const finalAmt = Number(row.final_amount || 0);
      const totalAmt = Number(row.total_amount || finalAmt);

      units += q;
      totalAmount += finalAmt;
      totalDiscount += totalAmt - finalAmt;
    });

    return { units, totalAmount, totalDiscount };
  }, [data]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-row">
        <h1 className="dashboard-title">Sales Management System</h1>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="dashboard-filters-row">
        <FiltersPanel
          filters={filters}
          sort={sort}
          onChange={setFilters}
          onSortChange={setSort}
          onReset={resetFilters}
        />
      </div>

      <div className="dashboard-summary-row">
        <div className="summary-card">
          <div className="summary-label">Total units sold</div>
          <div className="summary-value">{stats.units}</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Total Amount</div>
          <div className="summary-value">
            ₹{stats.totalAmount.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Total Discount</div>
          <div className="summary-value">
            ₹{stats.totalDiscount.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      <div className="dashboard-table-block">

        <div className="table-wrapper">
          <SalesTable rows={data} />
        </div>

        <PaginationControls
          pagination={pagination}
          onPageChange={setPage}
        />

      </div>
    </div>
  );
}
