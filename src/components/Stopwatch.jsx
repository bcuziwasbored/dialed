import { useEffect, useRef, useState } from 'react'

export default function Stopwatch({ value, onChange }) {
  const [running, setRunning] = useState(false)
  const startRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - (Number(value) || 0) * 1000
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startRef.current) / 1000
        onChange(Math.round(elapsed))
      }, 100)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-24 px-3 py-2 border border-walnut/20 rounded-lg bg-cream-pale text-walnut text-lg tabular-nums"
        placeholder="0"
      />
      <span className="text-camel text-sm">sec</span>
      {running ? (
        <button
          type="button"
          onClick={() => setRunning(false)}
          className="px-4 py-2 bg-rose-700 text-cream-pale text-sm rounded-full hover:bg-rose-800"
        >
          Stop
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setRunning(true)}
          className="px-4 py-2 bg-walnut text-cream-pale text-sm rounded-full hover:bg-saddle"
        >
          Start
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setRunning(false)
          onChange('')
        }}
        className="px-3 py-2 text-toffee text-sm rounded-full hover:bg-cream-soft"
      >
        Reset
      </button>
    </div>
  )
}
