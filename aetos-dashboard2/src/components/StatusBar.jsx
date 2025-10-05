// src/components/StatusBar.js
import React from "react";

function StatusBar({ status }) {
  return (
    <div className="status-bar h-6 text-center text-sm text-neutral-400">
      {status}
    </div>
  );
}

export default StatusBar;