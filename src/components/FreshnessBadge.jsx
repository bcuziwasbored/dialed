import { daysSince, freshnessLevel, freshnessStyle } from '../utils/dates.js'

export default function FreshnessBadge({ roastDate }) {
  const days = daysSince(roastDate)
  const level = freshnessLevel(days)
  const style = freshnessStyle(level)
  const label = days == null ? 'No roast date' : days === 0 ? 'Roasted today' : `${days}d post-roast`
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${style}`}>
      {label}
    </span>
  )
}
