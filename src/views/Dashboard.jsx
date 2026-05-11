import { useMemo } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { navigate } from '../hooks/useHashRoute.js'
import FreshnessBadge from '../components/FreshnessBadge.jsx'
import Stars from '../components/Stars.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatRatio, formatSeconds, ratio, METHOD_LABEL } from '../utils/brew.js'
import { formatDate, formatTime } from '../utils/dates.js'

export default function Dashboard() {
  const { beans, brews, settings } = useData()

  const beanById = useMemo(() => Object.fromEntries(beans.map((b) => [b.id, b])), [beans])
  const espressoBean = beanById[settings.active_espresso_bean_id]
  const dripBean = beanById[settings.active_drip_bean_id]

  const lastEspresso = brews.find((b) => b.brew_method === 'espresso')
  const lastDrip = brews.find((b) => b.brew_method === 'drip')

  const recent = brews.slice(0, 10)

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 5) return 'Late night brew'
    if (h < 11) return 'Good morning'
    if (h < 16) return 'Good afternoon'
    if (h < 21) return 'Good evening'
    return 'Late night brew'
  }, [])

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm text-stone-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="font-serif italic text-4xl text-stone-900 tracking-tight mt-1">{greeting}.</h1>
      </header>

      <section>
        <SectionTitle>Active beans</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          <ActiveSlot bean={espressoBean} method="espresso" />
          <ActiveSlot bean={dripBean} method="drip" />
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <LogCta method="espresso" />
        <LogCta method="drip" />
      </section>

      <section>
        <SectionTitle>Last brews</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          <LastBrewCard brew={lastEspresso} bean={lastEspresso && beanById[lastEspresso.bean_id]} />
          <LastBrewCard brew={lastDrip} bean={lastDrip && beanById[lastDrip.bean_id]} />
        </div>
      </section>

      <section>
        <SectionTitle>Recent</SectionTitle>
        {recent.length === 0 ? (
          <EmptyState
            title="No brews logged yet"
            message="Add a bean, then log your first shot."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm divide-y divide-stone-100 overflow-hidden">
            {recent.map((brew) => (
              <RecentRow key={brew.id} brew={brew} bean={beanById[brew.bean_id]} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h2 className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-3 font-medium">{children}</h2>
}

function LogCta({ method }) {
  const styles =
    method === 'espresso'
      ? 'bg-gradient-to-br from-amber-900 to-[#3a2317] text-amber-50 hover:from-amber-800 hover:to-[#4a2d1f]'
      : 'bg-gradient-to-br from-sky-800 to-sky-950 text-sky-50 hover:from-sky-700 hover:to-sky-900'
  const subtitle = method === 'espresso' ? 'Pull a shot' : 'Brew a cup'
  return (
    <button
      onClick={() => navigate(method === 'espresso' ? '/log-espresso' : '/log-drip')}
      className={`${styles} rounded-3xl p-6 text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="text-xs uppercase tracking-[0.2em] opacity-75">{subtitle}</div>
      <div className="text-3xl font-medium mt-2 font-serif italic">+ {METHOD_LABEL[method]}</div>
    </button>
  )
}

function ActiveSlot({ bean, method }) {
  if (!bean) {
    return (
      <div className="bg-white/60 border border-dashed border-stone-300/80 rounded-2xl p-5 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-1">{METHOD_LABEL[method]}</div>
        <p className="text-stone-500 text-sm">No active bean</p>
        <a href="#/beans" className="text-amber-700 hover:text-amber-800 text-sm font-medium">
          Pick one →
        </a>
      </div>
    )
  }
  const accent = method === 'espresso' ? 'border-l-amber-800' : 'border-l-sky-700'
  return (
    <div className={`bg-white rounded-2xl border border-stone-200/70 border-l-4 ${accent} shadow-sm p-5`}>
      <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-1">{METHOD_LABEL[method]}</div>
      <h3 className="font-serif text-xl text-stone-900 leading-snug">{bean.name}</h3>
      {bean.roaster && <div className="text-sm text-stone-500 mb-3">{bean.roaster}</div>}
      <FreshnessBadge roastDate={bean.roast_date} />
    </div>
  )
}

function LastBrewCard({ brew, bean }) {
  if (!brew) {
    return (
      <div className="bg-white/60 border border-dashed border-stone-300/80 rounded-2xl p-5 text-stone-500 text-sm">
        No brews yet.
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-5">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-xs uppercase tracking-[0.2em] text-stone-500">{METHOD_LABEL[brew.brew_method]}</span>
        <span className="text-xs text-stone-500">{formatTime(brew.timestamp)} · {formatDate(brew.timestamp)}</span>
      </div>
      <div className="font-serif text-lg text-stone-900">{bean?.name || 'Unknown bean'}</div>
      <BrewParams brew={brew} />
      <div className="mt-3"><Stars value={brew.overall_rating} readOnly size="sm" /></div>
      {brew.notes && <p className="text-sm text-stone-600 mt-3 italic">"{brew.notes}"</p>}
    </div>
  )
}

function BrewParams({ brew }) {
  if (brew.brew_method === 'espresso') {
    const grindLabel = brew.grinder === 'opus2'
      ? `Opus 2 · ${brew.grind_decimal}`
      : `Breville · ${brew.grind_integer}`
    return (
      <div className="text-sm text-stone-600 mt-1 tabular-nums">
        {grindLabel} · {brew.dose_grams}g → {brew.yield_grams}g · {formatRatio(ratio(brew.yield_grams, brew.dose_grams))} · {formatSeconds(brew.extraction_time_sec)}
      </div>
    )
  }
  return (
    <div className="text-sm text-stone-600 mt-1 tabular-nums">
      Opus {brew.grind_outer} +{brew.grind_inner} · {brew.coffee_dose_grams}g / {brew.water_grams}g · {formatRatio(ratio(brew.water_grams, brew.coffee_dose_grams))}
      {brew.total_brew_time_sec ? ` · ${formatSeconds(brew.total_brew_time_sec)}` : ''}
    </div>
  )
}

function RecentRow({ brew, bean }) {
  const accent = brew.brew_method === 'espresso' ? 'bg-amber-800' : 'bg-sky-700'
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className={`w-1.5 h-10 rounded-full ${accent}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-stone-900 truncate">{bean?.name || 'Unknown bean'}</span>
          <span className="text-xs text-stone-500 shrink-0">{formatDate(brew.timestamp)}</span>
        </div>
        <div className="text-xs text-stone-500 truncate tabular-nums">
          {METHOD_LABEL[brew.brew_method]} · {brew.brew_method === 'espresso'
            ? `${formatRatio(ratio(brew.yield_grams, brew.dose_grams))} · ${formatSeconds(brew.extraction_time_sec)}`
            : `${formatRatio(ratio(brew.water_grams, brew.coffee_dose_grams))}`}
        </div>
      </div>
      <Stars value={brew.overall_rating} readOnly size="sm" />
    </div>
  )
}
