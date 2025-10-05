// src/components/AnalyticsDashboard.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { mockAnalyticsData } from "../mockData";

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Enhanced Chart.js options for a polished dark theme look
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: { color: "#d4d4d8", font: { family: "Inter, sans-serif" } },
    },
    tooltip: {
      backgroundColor: "#262626",
      titleColor: "#f5f5f5",
      bodyColor: "#d4d4d8",
      borderColor: "#404040",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#a3a3a3", font: { family: "Inter, sans-serif" } },
      grid: { color: "rgba(255, 255, 255, 0.05)" },
    },
    y: {
      ticks: { color: "#a3a3a3", font: { family: "Inter, sans-serif" } },
      grid: { color: "rgba(255, 255, 255, 0.05)" },
    },
  },
};

const AnalyticsDashboard = () => {
  const analytics = mockAnalyticsData;

  if (!analytics) {
    return <div className="py-12 text-center text-neutral-500"><p>Analytics data is not available.</p></div>;
  }

  const sCurveChartData = {
    labels: analytics.mock_s_curve?.map((d) => d.year) || [],
    datasets: [{
        label: "Cumulative Publications",
        data: analytics.mock_s_curve?.map((d) => d.cumulative_count) || [],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const trlProgressionData = {
    labels: [
      ...(analytics.mock_trl_progression?.history.map((d) => d.year) || []),
      ...(analytics.mock_trl_progression?.forecast.map((d) => d.year) || []),
    ],
    datasets: [
      {
        label: "Historical Avg. TRL",
        data: analytics.mock_trl_progression?.history.map((d) => d.avg_trl) || [],
        borderColor: "#4ade80",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Forecasted Avg. TRL",
        data: [
          ...Array((analytics.mock_trl_progression?.history.length || 1) - 1).fill(null),
          analytics.mock_trl_progression?.history.slice(-1)[0]?.avg_trl,
          ...(analytics.mock_trl_progression?.forecast.map((d) => d.avg_trl) || []),
        ],
        borderColor: "#facc15",
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">Signal Analysis</h3>
          <div className="space-y-4 text-sm">
            <div><strong className="text-neutral-200">Summary:</strong><p className="text-neutral-300 mt-1 leading-relaxed">{analytics.overall_summary}</p></div>
            <div><strong className="text-neutral-200">Emerging Signals:</strong><ul className="list-disc list-inside text-neutral-300 mt-1 space-y-1">{analytics.emerging_signals?.map((signal, i) => <li key={i}>{signal}</li>)}</ul></div>
            <div><strong className="text-neutral-200">Key Players:</strong><ul className="list-disc list-inside text-neutral-300 mt-1 space-y-1">{analytics.key_players?.map((player, i) => <li key={i}>{player}</li>)}</ul></div>
          </div>
        </div>

        <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">Technology Convergence</h3>
          <ul className="space-y-3 text-sm text-neutral-300">
            {analytics.convergence?.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span>{item.tech_1}</span>
                <span className="text-sky-500 font-bold">&harr;</span>
                <span>{item.tech_2}</span>
                <span className="ml-auto text-xs bg-sky-500/10 text-sky-300 px-2 py-1 rounded-full font-medium">Strength: {item.strength.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-6 flex flex-col h-96">
        <h3 className="text-xl font-semibold mb-4 text-sky-400">S-Curve (Adoption Rate)</h3>
        <div className="flex-grow relative">
          <Line options={chartOptions} data={sCurveChartData} />
        </div>
      </div>

      <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-6 flex flex-col h-96">
        <h3 className="text-xl font-semibold mb-4 text-sky-400">TRL Progression & Forecast</h3>
        <div className="flex-grow relative">
          <Line options={chartOptions} data={trlProgressionData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;