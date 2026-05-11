import { useState } from 'react'

export default function AdjustmentGuide({ method = 'espresso' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-cream-pale rounded-2xl border border-walnut/10 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream-soft/60"
      >
        <span className="font-medium text-walnut">Adjustment guide</span>
        <span className="text-camel text-lg w-5 text-center">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 text-sm text-walnut">
          {method === 'espresso' ? <EspressoGuide /> : <DripGuide />}
        </div>
      )}
    </div>
  )
}

function EspressoGuide() {
  return (
    <>
      <Section title="Target">
        <ul className="list-disc list-inside space-y-1">
          <li>Time: 25–30 seconds</li>
          <li>Ratio: 1:2 (e.g. 18g in → 36g out)</li>
        </ul>
      </Section>
      <Section title="If the shot ran fast or tastes sour">
        <p>Go finer. Smaller grind exposes more surface area and slows the flow.</p>
      </Section>
      <Section title="If the shot ran slow or tastes bitter">
        <p>Go coarser. Less restriction speeds up the flow.</p>
      </Section>
      <Section title="If you're stuck between two settings">
        <p>Adjust dose ±0.5g instead of changing grind.</p>
      </Section>
      <Section title="After any grind change">
        <p>Purge 2–3g of grounds before pulling an evaluation shot.</p>
      </Section>
    </>
  )
}

function DripGuide() {
  return (
    <>
      <Section title="Opus (drip) grind">
        <p>Outer ring 1.00–11.00 in 0.25 steps, plus 0–3 inner ring micro clicks. Lower number = finer.</p>
      </Section>
      <Section title="If it tastes sour or thin">
        <p>Go finer — lower outer ring number, or add inner ring clicks.</p>
      </Section>
      <Section title="If it tastes bitter or harsh">
        <p>Go coarser.</p>
      </Section>
      <Section title="Typical ratios">
        <p>1:16 to 1:17 water-to-coffee. Adjust strength by changing dose, not grind.</p>
      </Section>
    </>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="font-medium text-walnut mb-0.5">{title}</h4>
      {children}
    </div>
  )
}
