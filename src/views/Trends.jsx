import { useMemo, useState } from 'react'
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '../contexts/DataContext.jsx'
import AdjustmentGuide from '../components/AdjustmentGuide.jsx'
import Stars from '../components/Stars.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatRatio, formatSeconds, ratio } from '../utils/brew.js'
import { formatDate } from '../utils/dates.js'

export default function Trends() {
  const { beans, brews } = useData()
  const [beanId, setBeanId] = useState('all')
  const [method, setMethod] = useState('espresso')

  const filtered = useMemo(() => {
    return brews
      .filter((b) => b.brew_method === method)
      .filter((b) => (beanId === 'all' ? true : b.bean_id === beanId))
      .slice()
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [brews, beanId, method])

  const chartData = useMemo(() => filtered.map((b, i) => ({
    idx: i + 1,
    date: formatDate(b.timestamp),
    grind: method === 'espresso'
      ? (b.grinder === 'opus2' ? b.grind_decimal : b.grind_integer)
      : Number(b.grind_outer) + (Number(b.grind_inner) || 0) * 0.0625,
    ratio: ratio(
      method === 'espresso' ? b.yield_grams : b.water_grams,
      method === 'espresso' ? b.dose_grams : b.coffee_dose_grams
    ),
    rating: b.overall_rating || null,
    extraction: b.extraction_time_sec,
  })), [filtered, method])

  const best = useMemo(() => {
    if (filtered.length === 0) return null
    return filtered.slice().sort((a, b) => (b.overall_rating || 0) - (a.overall_rating || 0))[0]
  }, [filtered])

  const beansWithBrews = useMemo(() => {
    const ids = new Set(brews.filter((b) => b.brew_method === method).map((b) => b.bean_id))
    return beans.filter((b) => ids.has(b.id))
  }, [beans, brews, method])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif italic text-4xl text-stone-900 tracking-tight">Trends</h1>
        <p className="text-stone-500 text-sm mt-1">How your dial-in changes over time.</p>
      </header>

      <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Method</label>
          <div className="flex gap-1">
            <Pill active={method === 'espresso'} onClick={() => setMethod('espresso')}>Espresso</Pill>
            <Pill active={method === 'drip'} onClick={() => setMethod('drip')}>Drip</Pill>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-stone-700 mb-1">Bean</label>
          <select
            value={beanId}
            onChange={(e) => setBeanId(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
          >
            <option value="all">All beans</option>
            {beansWithBrews.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Not enough data"
          message={`Log a few ${method} brews to see trends.`}
        />
      ) : (
        <>
          {best && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-amber-700 font-medium mb-2">Best brew</div>
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="font-serif text-lg text-stone-900">
                  {beans.find((b) => b.id === best.bean_id)?.name || 'Unknown'}
                </span>
                <Stars value={best.overall_rating} readOnly size="sm" />
              </div>
              <p className="text-sm text-stone-700 tabular-nums">
                {best.brew_method === 'espresso'
                  ? `${best.dose_grams}g → ${best.yield_grams}g · ${formatRatio(ratio(best.yield_grams, best.dose_grams))} · ${formatSeconds(best.extraction_time_sec)} · grind ${best.grinder === 'opus2' ? best.grind_decimal : best.grind_integer}`
                  : `${best.coffee_dose_grams}g / ${best.water_grams}g · ${formatRatio(ratio(best.water_grams, best.coffee_dose_grams))} · grind ${Number(best.grind_outer).toFixed(2)} + ${best.grind_inner || 0}`}
              </p>
              {best.notes && <p className="text-sm text-stone-600 italic mt-1">"{best.notes}"</p>}
            </div>
          )}

          <ChartCard title="Grind setting over time">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="idx" stroke="#78716c" fontSize={12} />
                <YAxis stroke="#78716c" fontSize={12} />
                <Tooltip content={<TrendTooltip />} />
                <Line type="monotone" dataKey="grind" stroke="#a16207" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Brew ratio over time">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="idx" stroke="#78716c" fontSize={12} />
                <YAxis stroke="#78716c" fontSize={12} />
                <Tooltip content={<TrendTooltip />} />
                <Line type="monotone" dataKey="ratio" stroke="#0369a1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Rating over time">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="idx" stroke="#78716c" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="#78716c" fontSize={12} />
                <Tooltip content={<TrendTooltip />} />
                <Line type="monotone" dataKey="rating" stroke="#b45309" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {method === 'espresso' && (
            <ChartCard title="Extraction time vs rating">
              <ResponsiveContainer width="100%" height={240}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="extraction" name="Time (s)" stroke="#78716c" fontSize={12} label={{ value: 'Seconds', position: 'insideBottom', offset: -5, fill: '#78716c', fontSize: 12 }} />
                  <YAxis dataKey="rating" name="Rating" domain={[0, 5]} stroke="#78716c" fontSize={12} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={chartData.filter((d) => d.extraction != null && d.rating != null)} fill="#92400e" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </>
      )}

      <AdjustmentGuide method={method} />
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5">
      <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium mb-4">{title}</h3>
      {children}
    </div>
  )
}

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-stone-200 rounded shadow-sm px-3 py-2 text-xs">
      <div className="text-stone-500">{d.date}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="text-stone-800 tabular-nums">
          {p.dataKey}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </div>
      ))}
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
        active ? 'bg-stone-900 text-white shadow-sm' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
      }`}
    >
      {children}
    </button>
  )
}
