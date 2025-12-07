// import React, { useCallback } from "react";

// function SearchBar({ value, onChange }) {

//   const handleChange = useCallback((e) => {
//     onChange(e.target.value);
//   }, [onChange]);

//   return (
//     <div className="card">
//       <label>Search</label>
//       <input
//         type="text"
//         placeholder="Search by name or phone..."
//         value={value}
//         onChange={handleChange}
//       />
//     </div>
//   );
// }

// export default React.memo(SearchBar);










// src/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-xs w-90">
      <span className="absolute inset-y-0 flex items-center text-sm pointer-events-none left-3 text-slate-400">
       
      </span>
      <input
        type="text"
        placeholder="Name, Phone no."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2 text-sm bg-white border rounded-lg border-slate-300 px-9 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
