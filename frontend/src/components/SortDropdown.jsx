export default function SortDropdown({ sort = {}, onChange }) {
  return (
    <div className="flex items-center gap-6 mb-4">

      <div>
        <label className="font-semibold mr-2">Sort By</label>
        <select
          value={sort.sortBy || "date"}
          onChange={(e) => onChange({ ...sort, sortBy: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="date">Date</option>
          <option value="customer_name">Customer</option>
          <option value="final_amount">Amount</option>
        </select>
      </div>

      <div>
        <label className="font-semibold mr-2">Order</label>
        <select
          value={sort.sortOrder || "desc"}
          onChange={(e) => onChange({ ...sort, sortOrder: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

    </div>
  );
}
