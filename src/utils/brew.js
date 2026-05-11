export function ratio(yieldOrWater, dose) {
  const y = Number(yieldOrWater)
  const d = Number(dose)
  if (!d || isNaN(y) || isNaN(d)) return null
  return y / d
}

export function formatRatio(r) {
  if (r == null || isNaN(r)) return '—'
  return `1:${r.toFixed(2)}`
}

export function formatSeconds(s) {
  const n = Number(s)
  if (!Number.isFinite(n)) return '—'
  const mins = Math.floor(n / 60)
  const secs = Math.floor(n % 60)
  if (mins === 0) return `${secs}s`
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const ESPRESSO_TIME_LOW = 22
const ESPRESSO_TIME_HIGH = 32

export function espressoAdjustmentHints({ extraction_time_sec, taste_balance }) {
  const hints = []
  if (extraction_time_sec != null && extraction_time_sec !== '') {
    const t = Number(extraction_time_sec)
    if (t > 0 && t < ESPRESSO_TIME_LOW) hints.push({ tone: 'finer', text: `Ran fast (${t}s) — try a finer grind.` })
    else if (t > ESPRESSO_TIME_HIGH) hints.push({ tone: 'coarser', text: `Ran slow (${t}s) — try a coarser grind.` })
  }
  if (taste_balance != null) {
    const b = Number(taste_balance)
    if (b <= -2) hints.push({ tone: 'finer', text: 'Tastes sour — go finer.' })
    else if (b >= 2) hints.push({ tone: 'coarser', text: 'Tastes bitter — go coarser.' })
  }
  return hints
}

export function dripAdjustmentHints({ taste_balance, total_brew_time_sec }) {
  const hints = []
  if (taste_balance != null) {
    const b = Number(taste_balance)
    if (b <= -2) hints.push({ tone: 'finer', text: 'Sour or thin — go finer (lower outer ring or add inner clicks).' })
    else if (b >= 2) hints.push({ tone: 'coarser', text: 'Bitter or harsh — go coarser.' })
  }
  if (total_brew_time_sec != null && total_brew_time_sec !== '') {
    const t = Number(total_brew_time_sec)
    if (t > 0 && t < 180) hints.push({ tone: 'finer', text: `Brew finished fast (${formatSeconds(t)}) — try finer.` })
    else if (t > 360) hints.push({ tone: 'coarser', text: `Brew dragged (${formatSeconds(t)}) — try coarser.` })
  }
  return hints
}

export const GRINDER_LABEL = {
  opus2: 'Fellow Opus 2',
  breville: 'Breville built-in',
  opus1: 'Fellow Opus (drip)',
}

export const METHOD_LABEL = {
  espresso: 'Espresso',
  drip: 'Drip',
}
