import React from "react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">V</div>
        <div className="sidebar-user">
          <div className="sidebar-app-name">Vault</div>
          <div className="sidebar-user-name">Anurag Yadav</div>
        </div>
        <span className="sidebar-chevron">▾</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <button className="sidebar-item sidebar-item-active">
            <span className="sidebar-icon">🏠</span>
            <span>Dashboard</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">🔗</span>
            <span>Nexus</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">📥</span>
            <span>Intake</span>
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Services</div>
          <button className="sidebar-item">
            <span className="sidebar-icon">●</span>
            <span>Pre-active</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">●</span>
            <span>Active</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">●</span>
            <span>Blocked</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">●</span>
            <span>Closed</span>
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Invoices</div>
          <button className="sidebar-item">
            <span className="sidebar-icon">🧾</span>
            <span>Proforma Invoices</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-icon">📄</span>
            <span>Final Invoices</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
