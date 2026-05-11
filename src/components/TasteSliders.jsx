function Slider({ label, value, onChange, min, max, step = 1, leftLabel, rightLabel, centerLabel }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-walnut">{label}</label>
        <span className="text-sm text-camel tabular-nums">{value ?? '—'}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? Math.round((min + max) / 2)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-camel mt-1">
        <span>{leftLabel}</span>
        {centerLabel && <span>{centerLabel}</span>}
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}

export default function TasteSliders({ values, onChange }) {
  const set = (key) => (v) => onChange({ ...values, [key]: v })
  return (
    <div className="space-y-5">
      <Slider
        label="Balance"
        value={values.taste_balance}
        onChange={set('taste_balance')}
        min={-3}
        max={3}
        leftLabel="Sour"
        centerLabel="Balanced"
        rightLabel="Bitter"
      />
      <Slider
        label="Body"
        value={values.taste_body}
        onChange={set('taste_body')}
        min={1}
        max={5}
        leftLabel="Thin"
        rightLabel="Heavy"
      />
      <Slider
        label="Sweetness"
        value={values.taste_sweetness}
        onChange={set('taste_sweetness')}
        min={1}
        max={5}
        leftLabel="None"
        rightLabel="Lots"
      />
      <Slider
        label="Finish"
        value={values.taste_finish}
        onChange={set('taste_finish')}
        min={1}
        max={5}
        leftLabel="Short"
        rightLabel="Long"
      />
    </div>
  )
}
