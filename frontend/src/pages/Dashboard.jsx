


// src/pages/Dashboard.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FiltersPanel from "../components/FiltersPanel.jsx";
import SalesTable from "../components/SalesTable.jsx";
import PaginationControls from "../components/PaginationControls.jsx";
import useSalesData from "../hooks/useSalesData.js";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    ageMin: "",
    ageMax: "",
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateFrom: "",
    dateTo: "",
  });

  const [sort, setSort] = useState({
    sortBy: "customer_name",
    sortOrder: "asc",
  });

  const [page, setPage] = useState(1);

  const { data = [], pagination, loading, error } = useSalesData({
    search,
    filters,
    sort,
    page,
  });

  // Simple stats based on current page
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        discountSrs: 0,
        recordsCount: 0,
      };
    }

    let totalUnits = 0;
    let totalAmount = 0;
    let totalDiscount = 0;

    for (const row of data) {
      const qty = Number(row.quantity || 0);
      const finalAmount = Number(row.final_amount || row.total_amount || 0);
      const gross = Number(row.total_amount || finalAmount);

      totalUnits += qty;
      totalAmount += finalAmount;
      totalDiscount += Math.max(gross - finalAmount, 0);
    }

    return {
      totalUnits,
      totalAmount,
      totalDiscount,
      recordsCount: data.length,
      discountSrs: data.length, // just mimic "xx SRs"
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left sidebar */}
      <Sidebar />

      {/* Right main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-md font-semibold text-slate-900">
              Sales Management System
            </h2>
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-6 py-4 space-y-4">
          {/* Filters + Stats */}
          <FiltersPanel
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1); // reset page on filter change
            }}
            sort={sort}
            onSortChange={(nextSort) => {
              setSort(nextSort);
              setPage(1);
            }}
            stats={stats}
          />

          {/* Table card */}
          <section className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loading && (
              <div className="py-10 text-center text-sm text-slate-500">
                Loading…
              </div>
            )}

            {error && !loading && (
              <div className="py-10 text-center text-sm text-red-500">
                Error loading data
              </div>
            )}

            {!loading && !error && (
              <>
                <SalesTable rows={data} />
                <PaginationControls
                  pagination={pagination}
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
