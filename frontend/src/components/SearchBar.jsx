import React from "react";

function SearchIcon() {
  return (
    <svg
      className="searchbar-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15.5 14h-.79l-.28-.27a6 6 0 10-.71.71l.28.27v.79L20 20.5 21.5 19l-5.99-5zM10 15a5 5 0 110-10 5 5 0 010 10z"
        fill="#9ca3af"
      />
    </svg>
  );
}

export default function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar">
      <SearchIcon />
      <input
        className="searchbar-input"
        type="text"
        placeholder="Name, Phone no."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
