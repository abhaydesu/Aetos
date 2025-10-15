// src/components/AnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { fetchDocumentsByTopic } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { color: '#e5e7eb' } } },
  scales: {
    x: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    y: { ticks: { color: '#d1d5db' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
  }
}

function estimateTrlFromDoc(doc) {
  try {
    if (doc.TRL && typeof doc.TRL === 'number') return Math.max(1, Math.min(9, Math.round(doc.TRL)))
    const funding = (doc.funding_details || '').replace(/[,₹$ ]/g, '')
    const m = funding.match(/(\d+(\.\d+)?)/)
    if (m) {
      const val = parseFloat(m[1])
      if (val >= 50_000_000) return 8
      if (val >= 5_000_000) return 7
      if (val >= 500_000) return 6
      if (val >= 50_000) return 5
      if (val >= 5_000) return 4
      return 3
    }
    const prog = (doc.progress || doc.summary || '').toLowerCase()
    if (prog.includes('commercial') || prog.includes('production') || prog.includes('deployed') || prog.includes('live') || prog.includes('scale')) return 8
    if (prog.includes('pilot') || prog.includes('trial') || prog.includes('beta')) return 6
    if (prog.includes('prototype') || prog.includes('demo') || prog.includes('proof of concept') || prog.includes('poc')) return 4
  } catch (e) {}
  return 3
}

function buildSCurve(docs, start = 2018, end = new Date().getFullYear()) {
  const counts = {}
  for (let y = start; y <= end; y++) counts[y] = 0
  docs.forEach(d => {
    const published = d.published || d.published_date || d.published_at || (d.raw && d.raw.published) || null
    let year = null
    if (published) {
      const dt = new Date(published)
      if (!isNaN(dt)) year = dt.getFullYear()
    }
    if (!year && d.published && typeof d.published === 'object' && d.published.$date) {
      const dt = new Date(d.published.$date)
      if (!isNaN(dt)) year = dt.getFullYear()
    }
    if (!year) year = start
    if (year < start) year = start
    if (year > end) year = end
    counts[year] = (counts[year] || 0) + 1
  })
  const labels = Object.keys(counts).map(Number).sort((a, b) => a - b)
  const cumulative = []
  let running = 0
  labels.forEach(y => { running += counts[y]; cumulative.push({ year: y, cumulative_count: running }) })
  return cumulative
}

function buildTrlProgression(docs) {
  const buckets = {}
  docs.forEach(d => {
    const trl = estimateTrlFromDoc(d)
    const year = (() => {
      const p = d.published || d.published_date || d.published_at || (d.raw && d.raw.published) || null
      if (p) {
        const dt = new Date(p)
        if (!isNaN(dt)) return dt.getFullYear()
      }
      if (d.published && typeof d.published === 'object' && d.published.$date) {
        const dt = new Date(d.published.$date)
        if (!isNaN(dt)) return dt.getFullYear()
      }
      return new Date().getFullYear()
    })()
    if (!buckets[year]) buckets[year] = { sum: 0, n: 0 }
    buckets[year].sum += trl
    buckets[year].n += 1
  })
  const years = Object.keys(buckets).map(Number).sort((a, b) => a - b)
  const history = years.map(y => ({ year: y, avg_trl: +(buckets[y].sum / buckets[y].n).toFixed(2) }))
  const forecast = []
  if (history.length >= 2) {
    const last = history[history.length - 1].avg_trl
    const prev = history[history.length - 2].avg_trl
    const delta = last - prev
    for (let i = 1; i <= 3; i++) forecast.push({ year: history[history.length - 1].year + i, avg_trl: +(last + delta * i).toFixed(2) })
  } else {
    const base = history.length ? history[history.length - 1].avg_trl : 3.5
    for (let i = 1; i <= 3; i++) forecast.push({ year: (new Date()).getFullYear() + i, avg_trl: +(base + 0.5 * i).toFixed(2) })
  }
  return { history, forecast }
}

const AnalyticsDashboard = ({ topic = 'drones' }) => {
  const [docs, setDocs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    fetchDocumentsByTopic(topic)
      .then((data) => {
        if (!mounted) return
        if (!Array.isArray(data)) {
          if (data && data.documents && Array.isArray(data.documents)) setDocs(data.documents)
          else { setError('Backend returned unexpected shape'); setDocs([]) }
        } else {
          setDocs(data)
        }
      })
      .catch((err) => { if (!mounted) return; setError(err.message || String(err)); setDocs([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [topic])

  if (loading) return <div className="mt-12 text-center text-neutral-500">Loading analytics…</div>
  if (error && !docs) return <div className="mt-12 text-center text-red-400">Error: {error}</div>

  const dataDocs = docs || []
  const sCurve = buildSCurve(dataDocs, 2018, new Date().getFullYear())
  const trl = buildTrlProgression(dataDocs)

  const sCurveChartData = {
    labels: sCurve.map(d => d.year),
    datasets: [{ label: 'Cumulative Publications', data: sCurve.map(d => d.cumulative_count), borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.18)', fill: true, tension: 0.3 }]
  }

  const trlChartData = {
    labels: [...trl.history.map(d => d.year), ...trl.forecast.map(d => d.year)],
    datasets: [
      { label: 'Historical Avg. TRL', data: trl.history.map(d => d.avg_trl), borderColor: '#22c55e', fill: false, tension: 0.1 },
      { label: 'Forecasted Avg. TRL', data: [...Array(Math.max(0, trl.history.length - 1)).fill(null), trl.history.slice(-1)[0]?.avg_trl, ...trl.forecast.map(d => d.avg_trl)], borderColor: '#facc15', borderDash: [5, 5], fill: false, tension: 0.1 }
    ]
  }

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6 text-center text-neutral-100">Analytics Dashboard for "{topic}"</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">Signal Summary</h3>
          <p className="text-neutral-300 text-sm mb-2">{dataDocs.length} documents analyzed — generated from backend search.</p>
          <div className="text-sm text-neutral-300 space-y-2">
            <div><strong>Years covered:</strong> {sCurve.length ? `${sCurve[0].year} — ${sCurve[sCurve.length-1].year}` : 'n/a'}</div>
            <div><strong>Avg documents / year (recent):</strong> {sCurve.length ? Math.round((sCurve[sCurve.length-1].cumulative_count / sCurve.length) * 10) / 10 : 'n/a'}</div>
            <div><strong>Top insights:</strong></div>
            <ul className="list-disc list-inside text-neutral-300 mt-1">
              {dataDocs.length ? dataDocs.slice(0,5).map((d, i) => <li key={i}>{d.title || d.summary || d.url || 'untitled'}</li>) : <li>No documents</li>}
            </ul>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 flex flex-col h-96">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">S-Curve (Adoption)</h3>
          <div className="flex-grow relative">{sCurve.length ? <Line options={chartOptions} data={sCurveChartData} /> : <p className="flex items-center justify-center h-full text-neutral-500 italic">No S-Curve data available.</p>}</div>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 flex flex-col h-96">
          <h3 className="text-xl font-semibold mb-3 text-sky-400">TRL Progression & Forecast</h3>
          <div className="flex-grow relative">{trl.history.length ? <Line options={chartOptions} data={trlChartData} /> : <p className="flex items-center justify-center h-full text-neutral-500 italic">No TRL data available.</p>}</div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
