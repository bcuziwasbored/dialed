export default function Stars({ value, onChange, size = 'md', readOnly = false }) {
  const stars = [1, 2, 3, 4, 5]
  const px = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-2xl'
  return (
    <div className={`flex gap-1 ${px}`} role={readOnly ? 'img' : 'radiogroup'} aria-label="Rating">
      {stars.map((n) => {
        const filled = value >= n
        const cls = filled ? 'text-amber-500' : 'text-stone-300'
        if (readOnly) {
          return <span key={n} className={cls}>★</span>
        }
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(value === n ? 0 : n)}
            className={`${cls} hover:text-amber-400 transition-colors leading-none cursor-pointer`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
