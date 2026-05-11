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
        <p className="text-sm text-camel">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1 className="font-serif italic text-4xl text-walnut tracking-tight mt-1">{greeting}.</h1>
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
          <div className="bg-cream-pale rounded-2xl border border-walnut/10 divide-y divide-walnut/5 overflow-hidden">
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
  return <h2 className="text-xs uppercase tracking-[0.2em] text-camel mb-3 font-medium">{children}</h2>
}

function LogCta({ method }) {
  const styles =
    method === 'espresso'
      ? 'bg-walnut text-cream-pale hover:bg-saddle'
      : 'bg-olive text-cream-pale hover:bg-ebony'
  const subtitle = method === 'espresso' ? 'Pull a shot' : 'Brew a cup'
  return (
    <button
      onClick={() => navigate(method === 'espresso' ? '/log-espresso' : '/log-drip')}
      className={`${styles} rounded-3xl p-6 text-left transition-colors`}
    >
      <div className="text-xs uppercase tracking-[0.2em] opacity-75">{subtitle}</div>
      <div className="text-3xl font-medium mt-2 font-serif italic">+ {METHOD_LABEL[method]}</div>
    </button>
  )
}

function ActiveSlot({ bean, method }) {
  if (!bean) {
    return (
      <div className="bg-cream-pale/60 border border-dashed border-walnut/15 rounded-2xl p-5 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-camel mb-1">{METHOD_LABEL[method]}</div>
        <p className="text-toffee text-sm">No active bean</p>
        <a href="#/beans" className="text-saddle hover:text-walnut text-sm font-medium">
          Pick one →
        </a>
      </div>
    )
  }
  const stripe = method === 'espresso' ? 'border-l-saddle' : 'border-l-olive'
  return (
    <div className={`bg-cream-pale rounded-2xl border border-walnut/10 border-l-4 ${stripe} p-5`}>
      <div className="text-xs uppercase tracking-[0.2em] text-camel mb-1">{METHOD_LABEL[method]}</div>
      <h3 className="font-serif text-xl text-walnut leading-snug">{bean.name}</h3>
      {bean.roaster && <div className="text-sm text-toffee mb-3">{bean.roaster}</div>}
      <FreshnessBadge roastDate={bean.roast_date} />
    </div>
  )
}

function LastBrewCard({ brew, bean }) {
  if (!brew) {
    return (
      <div className="bg-cream-pale/60 border border-dashed border-walnut/15 rounded-2xl p-5 text-toffee text-sm">
        No brews yet.
      </div>
    )
  }
  return (
    <div className="bg-cream-pale rounded-2xl border border-walnut/10 p-5">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-xs uppercase tracking-[0.2em] text-camel">{METHOD_LABEL[brew.brew_method]}</span>
        <span className="text-xs text-camel">{formatTime(brew.timestamp)} · {formatDate(brew.timestamp)}</span>
      </div>
      <div className="font-serif text-lg text-walnut">{bean?.name || 'Unknown bean'}</div>
      <BrewParams brew={brew} />
      <div className="mt-3"><Stars value={brew.overall_rating} readOnly size="sm" /></div>
      {brew.notes && <p className="text-sm text-toffee mt-3 italic">"{brew.notes}"</p>}
    </div>
  )
}

function BrewParams({ brew }) {
  if (brew.brew_method === 'espresso') {
    const grindLabel = brew.grinder === 'opus2'
      ? `Opus 2 · ${brew.grind_decimal}`
      : `Breville · ${brew.grind_integer}`
    return (
      <div className="text-sm text-toffee mt-1 tabular-nums">
        {grindLabel} · {brew.dose_grams}g → {brew.yield_grams}g · {formatRatio(ratio(brew.yield_grams, brew.dose_grams))} · {formatSeconds(brew.extraction_time_sec)}
      </div>
    )
  }
  return (
    <div className="text-sm text-toffee mt-1 tabular-nums">
      Opus {brew.grind_outer} +{brew.grind_inner} · {brew.coffee_dose_grams}g / {brew.water_grams}g · {formatRatio(ratio(brew.water_grams, brew.coffee_dose_grams))}
      {brew.total_brew_time_sec ? ` · ${formatSeconds(brew.total_brew_time_sec)}` : ''}
    </div>
  )
}

function RecentRow({ brew, bean }) {
  const accent = brew.brew_method === 'espresso' ? 'bg-saddle' : 'bg-olive'
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className={`w-1.5 h-10 rounded-full ${accent}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-walnut truncate">{bean?.name || 'Unknown bean'}</span>
          <span className="text-xs text-camel shrink-0">{formatDate(brew.timestamp)}</span>
        </div>
        <div className="text-xs text-camel truncate tabular-nums">
          {METHOD_LABEL[brew.brew_method]} · {brew.brew_method === 'espresso'
            ? `${formatRatio(ratio(brew.yield_grams, brew.dose_grams))} · ${formatSeconds(brew.extraction_time_sec)}`
            : `${formatRatio(ratio(brew.water_grams, brew.coffee_dose_grams))}`}
        </div>
      </div>
      <Stars value={brew.overall_rating} readOnly size="sm" />
    </div>
  )
}
