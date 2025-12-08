import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <Router>
      <div className="layout">
        <Sidebar />

        <div className="content">
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
}
