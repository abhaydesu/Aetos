// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlansAndPricing from "./pages/PlansAndPricing.jsx";

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<PlansAndPricing />} />
      </Routes>
    </Router>
  );
}

export default App;