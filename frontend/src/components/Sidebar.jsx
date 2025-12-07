// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-64 border-r bg-slate-900 text-slate-50 border-slate-800">
      {/* Top brand section */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
        <div className="flex items-center justify-center text-sm font-bold bg-indigo-500 rounded-lg h-9 w-9">
          V
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold leading-tight text-red-500">Vault</p>
          <p className="text-xs text-slate-300">Anurag Yadav</p>
        </div>
        <button className="text-xl leading-none text-slate-300">▾</button>
      </div>

      {/* Navigation groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 text-sm">
        {/* Top links */}
        <div className="space-y-1">
          <SidebarItem label="Dashboard" />
          <SidebarItem label="Nexus" />
          <SidebarItem label="Intake" />
        </div>

        {/* Services */}
        <SidebarGroup title="Services">
          <SidebarItem label="Pre-active" />
          <SidebarItem label="Active" />
          <SidebarItem label="Blocked" />
          <SidebarItem label="Closed" />
        </SidebarGroup>

        {/* Invoices */}
        <SidebarGroup title="Invoices">
          <SidebarItem label="Proforma Invoices" active />
          <SidebarItem label="Final Invoices" />
        </SidebarGroup>
      </nav>
    </aside>
  );
}

function SidebarGroup({ title, children }) {
  return (
    <div className="border rounded-xl bg-slate-800/60 border-slate-700/70">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/70">
        <span className="text-xs font-medium tracking-wide uppercase text-slate-300">
          {title}
        </span>
        <span className="text-xs text-slate-400">▾</span>
      </div>
      <div className="py-1">{children}</div>
    </div>
  );
}

function SidebarItem({ label, active = false }) {
  return (
    <button
      className={`flex w-full items-center gap-2 px-4 py-2 text-left rounded-lg text-xs ${
        active
          ? "bg-slate-100 text-slate-900 font-semibold"
          : "text-slate-200 hover:bg-slate-700/80"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      <span>{label}</span>
    </button>
  );
}

















