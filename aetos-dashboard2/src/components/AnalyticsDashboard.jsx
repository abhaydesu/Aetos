// src/components/AnalyticsDashboard.jsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { mockAnalyticsData } from '../mockData';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Shared Chart.js options for our dark theme
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { color: '#e5e7eb' } } },
  scales: {
    x: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    y: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
  },
};

const AnalyticsDashboard = ({ topic }) => {
  const analytics = mockAnalyticsData;

  if (!analytics) {
    return <div className="mt-12 text-center text-neutral-500"><p>Analytics data is not available.</p></div>;
  }

  // --- Process data for charts ---
  const sCurveChartData = {
    labels: analytics.mock_s_curve?.map(d => d.year) || [],
    datasets: [{
      label: 'Cumulative Publications (S-Curve)',
      data: analytics.mock_s_curve?.map(d => d.cumulative_count) || [],
      borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.2)', fill: true, tension: 0.4
    }]
  };

  const trlProgressionData = {
    labels: [
      ...(analytics.mock_trl_progression?.history.map(d => d.year) || []),
      ...(analytics.mock_trl_progression?.forecast.map(d => d.year) || [])
    ],
    datasets: [
      {
        label: 'Historical Avg. TRL',
        data: analytics.mock_trl_progression?.history.map(d => d.avg_trl) || [],
        borderColor: '#22c55e', fill: false, tension: 0.1
      },
      {
        label: 'Forecasted Avg. TRL',
        data: [
          ...Array((analytics.mock_trl_progression?.history.length || 1) - 1).fill(null),
          analytics.mock_trl_progression?.history.slice(-1)[0]?.avg_trl,
          ...(analytics.mock_trl_progression?.forecast.map(d => d.avg_trl) || [])
        ],
        borderColor: '#facc15', borderDash: [5, 5], fill: false, tension: 0.1
      }
    ]
  };

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6 text-center text-neutral-100">
        Analytics Dashboard for "{topic}"
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* --- Signal Analysis Card (Full JSX Restored) --- */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">Signal Analysis</h3>
          {analytics && !analytics.error ? (
            <div className="space-y-4 text-sm">
                <div><strong className="text-neutral-200">Summary:</strong><p className="text-neutral-300">{analytics.overall_summary}</p></div>
                <div><strong className="text-neutral-200">Emerging Signals:</strong><ul className="list-disc list-inside text-neutral-300 mt-1">{analytics.emerging_signals?.map((signal, i) => <li key={i}>{signal}</li>)}</ul></div>
                <div><strong className="text-neutral-200">Key Players:</strong><ul className="list-disc list-inside text-neutral-300 mt-1">{analytics.key_players?.map((player, i) => <li key={i}>{player}</li>)}</ul></div>
            </div>
          ) : <p className="text-neutral-500 italic">Not enough data for synthesis.</p>}
        </div>

        {/* --- Technology Convergence Card (Full JSX Restored) --- */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">Technology Convergence</h3>
          {analytics.convergence && analytics.convergence.length > 0 ? (
            <ul className="space-y-2 text-sm text-neutral-300">
              {analytics.convergence.map((item, i) => (
                <li key={i} className="flex items-center">
                  <span>{item.tech_1}</span>
                  <span className="mx-2 text-sky-400">&harr;</span>
                  <span>{item.tech_2}</span>
                  <span className="ml-auto text-xs bg-neutral-700 text-neutral-200 px-2 py-1 rounded-full">Strength: {item.strength.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-neutral-500 italic">Not enough data for convergence analysis.</p>}
        </div>

        {/* --- Chart Cards --- */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 flex flex-col h-96">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">S-Curve (Adoption Rate)</h3>
          <div className="flex-grow relative">
            {analytics.mock_s_curve ? <Line options={chartOptions} data={sCurveChartData} /> : <p className="flex items-center justify-center h-full text-neutral-500 italic">No S-Curve data available.</p>}
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 flex flex-col h-96">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">TRL Progression & Forecast</h3>
          <div className="flex-grow relative">
            {analytics.mock_trl_progression ? <Line options={chartOptions} data={trlProgressionData} /> : <p className="flex items-center justify-center h-full text-neutral-500 italic">No TRL data available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;