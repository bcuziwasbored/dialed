import { daysSince, freshnessLevel } from '../utils/dates.js'

function styleFor(level) {
  switch (level) {
    case 'fresh':   return 'bg-sage-light/40 text-olive border-sage/40'
    case 'fading':  return 'bg-camel/20 text-saddle border-camel/40'
    case 'stale':   return 'bg-rose-100/70 text-rose-800 border-rose-200/70'
    default:        return 'bg-cream-soft text-camel border-camel/30'
  }
}

export default function FreshnessBadge({ roastDate }) {
  const days = daysSince(roastDate)
  const level = freshnessLevel(days)
  const style = styleFor(level)
  const label = days == null ? 'No roast date' : days === 0 ? 'Roasted today' : `${days}d post-roast`
  return (
    <span className={`inline-block w-fit text-xs px-2.5 py-0.5 rounded-full border ${style}`}>
      {label}
    </span>
  )
}
