import { useMemo, useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { navigate } from '../hooks/useHashRoute.js'
import Stars from '../components/Stars.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatRatio, formatSeconds, ratio, METHOD_LABEL, GRINDER_LABEL } from '../utils/brew.js'
import { formatDate, formatTime } from '../utils/dates.js'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'drip', label: 'Drip' },
]

export default function BrewLog() {
  const { beans, brews, deleteBrew } = useData()
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const beanById = useMemo(() => Object.fromEntries(beans.map((b) => [b.id, b])), [beans])

  const filtered = useMemo(() => {
    return filter === 'all' ? brews : brews.filter((b) => b.brew_method === filter)
  }, [brews, filter])

  function handleDelete(brew) {
    if (confirm('Delete this brew?')) deleteBrew(brew.id)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-serif italic text-4xl text-stone-900 tracking-tight">Brews</h1>
        <span className="text-sm text-stone-500 tabular-nums">{filtered.length} brew{filtered.length === 1 ? '' : 's'}</span>
      </header>

      <div className="flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white/80 border border-stone-300/70 text-stone-700 hover:bg-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No brews logged"
          message={filter === 'all' ? 'Add a bean, then log your first shot.' : `No ${filter} brews yet.`}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden">
          {filtered.map((brew) => (
            <BrewRow
              key={brew.id}
              brew={brew}
              bean={beanById[brew.bean_id]}
              expanded={expanded === brew.id}
              onToggle={() => setExpanded(expanded === brew.id ? null : brew.id)}
              onDelete={() => handleDelete(brew)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BrewRow({ brew, bean, expanded, onToggle, onDelete }) {
  const accent = brew.brew_method === 'espresso' ? 'bg-amber-800' : 'bg-sky-700'
  return (
    <div className="border-b border-stone-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-stone-50/70 text-left"
      >
        <div className={`w-1.5 h-12 rounded-full ${accent} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-serif text-lg text-stone-900 truncate">
              {bean?.name || 'Unknown bean'}
            </span>
            <span className="text-xs text-stone-500 shrink-0 tabular-nums">
              {formatDate(brew.timestamp)} · {formatTime(brew.timestamp)}
            </span>
          </div>
          <div className="text-xs text-stone-600 truncate tabular-nums">
            {METHOD_LABEL[brew.brew_method]} ·{' '}
            {brew.brew_method === 'espresso'
              ? `${brew.dose_grams}g → ${brew.yield_grams}g · ${formatRatio(ratio(brew.yield_grams, brew.dose_grams))} · ${formatSeconds(brew.extraction_time_sec)}`
              : `${brew.coffee_dose_grams}g / ${brew.water_grams}g · ${formatRatio(ratio(brew.water_grams, brew.coffee_dose_grams))}`}
          </div>
        </div>
        <Stars value={brew.overall_rating} readOnly size="sm" />
      </button>

      {expanded && (
        <div className="bg-stone-50/70 border-t border-stone-200/70 px-5 py-5 space-y-4">
          <BrewDetails brew={brew} />
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`${brew.brew_method === 'espresso' ? '/log-espresso' : '/log-drip'}?clone=${brew.id}`)}
              className="text-sm px-4 py-1.5 bg-stone-800 text-white rounded-full hover:bg-stone-900 shadow-sm"
            >
              Clone & log new
            </button>
            <button
              onClick={onDelete}
              className="text-sm px-4 py-1.5 text-rose-700 rounded-full hover:bg-rose-50 ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function BrewDetails({ brew }) {
  const rows = []
  rows.push(['Grinder', GRINDER_LABEL[brew.grinder] || brew.grinder])
  if (brew.brew_method === 'espresso') {
    rows.push(['Grind', brew.grinder === 'opus2' ? brew.grind_decimal : brew.grind_integer])
    rows.push(['Dose / yield', `${brew.dose_grams}g → ${brew.yield_grams}g`])
    rows.push(['Ratio', formatRatio(ratio(brew.yield_grams, brew.dose_grams))])
    rows.push(['Extraction', formatSeconds(brew.extraction_time_sec)])
    rows.push(['Pressure', brew.pressure_ok ? 'In range' : 'Out of range'])
  } else {
    rows.push(['Grind', `${Number(brew.grind_outer).toFixed(2)} + ${brew.grind_inner || 0}`])
    rows.push(['Coffee / water', `${brew.coffee_dose_grams}g / ${brew.water_grams}g`])
    rows.push(['Ratio', formatRatio(ratio(brew.water_grams, brew.coffee_dose_grams))])
    if (brew.bloom_time_sec) rows.push(['Bloom', formatSeconds(brew.bloom_time_sec)])
    if (brew.total_brew_time_sec) rows.push(['Total time', formatSeconds(brew.total_brew_time_sec)])
  }
  rows.push(['Taste', `Balance ${brew.taste_balance}, body ${brew.taste_body}, sweet ${brew.taste_sweetness}, finish ${brew.taste_finish}`])
  return (
    <>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="text-stone-500 w-32 shrink-0">{k}</dt>
            <dd className="text-stone-800 tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      {brew.notes && (
        <p className="text-sm text-stone-700 italic bg-white border border-stone-200/70 rounded-xl px-4 py-3">
          "{brew.notes}"
        </p>
      )}
    </>
  )
}
