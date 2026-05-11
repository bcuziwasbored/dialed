export function daysSince(isoDate) {
  if (!isoDate) return null
  const then = new Date(isoDate)
  if (isNaN(then.getTime())) return null
  const now = new Date()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

export function freshnessLevel(daysSinceRoast) {
  if (daysSinceRoast == null) return 'unknown'
  if (daysSinceRoast < 14) return 'fresh'
  if (daysSinceRoast <= 21) return 'fading'
  return 'stale'
}

export function freshnessStyle(level) {
  switch (level) {
    case 'fresh':   return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'fading':  return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'stale':   return 'bg-rose-100 text-rose-800 border-rose-200'
    default:        return 'bg-stone-100 text-stone-600 border-stone-200'
  }
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}
