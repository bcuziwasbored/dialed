import { useMemo, useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { navigate } from '../hooks/useHashRoute.js'
import Stars from '../components/Stars.jsx'
import Stopwatch from '../components/Stopwatch.jsx'
import TasteSliders from '../components/TasteSliders.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { espressoAdjustmentHints, formatRatio, ratio } from '../utils/brew.js'

function defaultForm(activeBeanId) {
  return {
    bean_id: activeBeanId || '',
    grinder: 'opus2',
    grind_decimal: 3.5,
    grind_integer: 7,
    dose_grams: 18,
    yield_grams: 36,
    extraction_time_sec: '',
    pressure_ok: true,
    taste_balance: 0,
    taste_body: 3,
    taste_sweetness: 3,
    taste_finish: 3,
    overall_rating: 0,
    notes: '',
  }
}

export default function LogEspresso({ cloneId }) {
  const { beans, brews, settings, addBrew } = useData()

  const cloneFrom = useMemo(() => {
    if (cloneId) return brews.find((b) => b.id === cloneId)
    return brews.find((b) => b.brew_method === 'espresso')
  }, [brews, cloneId])

  const [form, setForm] = useState(() => {
    const base = defaultForm(settings.active_espresso_bean_id)
    if (cloneFrom) {
      return {
        ...base,
        bean_id: cloneFrom.bean_id,
        grinder: cloneFrom.grinder,
        grind_decimal: cloneFrom.grind_decimal ?? base.grind_decimal,
        grind_integer: cloneFrom.grind_integer ?? base.grind_integer,
        dose_grams: cloneFrom.dose_grams ?? base.dose_grams,
        yield_grams: cloneFrom.yield_grams ?? base.yield_grams,
      }
    }
    return base
  })

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }))
  const setNum = (k) => (e) => {
    const val = e.target.value
    setForm((f) => ({ ...f, [k]: val === '' ? '' : Number(val) }))
  }

  const espressoBeans = useMemo(() => beans.filter((b) => b.status !== 'finished'), [beans])
  const currentRatio = ratio(form.yield_grams, form.dose_grams)
  const hints = espressoAdjustmentHints(form)

  if (espressoBeans.length === 0) {
    return (
      <EmptyState
        title="No active beans"
        message="Add a bean before logging a shot."
        action={
          <button
            onClick={() => navigate('/beans')}
            className="px-5 py-2.5 bg-walnut text-cream-pale rounded-full font-medium hover:bg-saddle"
          >
            Go to Beans
          </button>
        }
      />
    )
  }

  function save({ clone }) {
    if (!form.bean_id) return
    const payload = {
      bean_id: form.bean_id,
      brew_method: 'espresso',
      grinder: form.grinder,
      grind_decimal: form.grinder === 'opus2' ? Number(form.grind_decimal) : null,
      grind_integer: form.grinder === 'breville' ? Number(form.grind_integer) : null,
      dose_grams: Number(form.dose_grams) || null,
      yield_grams: Number(form.yield_grams) || null,
      brew_ratio: currentRatio,
      extraction_time_sec: form.extraction_time_sec === '' ? null : Number(form.extraction_time_sec),
      pressure_ok: !!form.pressure_ok,
      taste_balance: Number(form.taste_balance),
      taste_body: Number(form.taste_body),
      taste_sweetness: Number(form.taste_sweetness),
      taste_finish: Number(form.taste_finish),
      overall_rating: Number(form.overall_rating) || 0,
      notes: form.notes,
    }
    addBrew(payload)
    if (clone) {
      setForm((f) => ({
        ...f,
        extraction_time_sec: '',
        taste_balance: 0,
        taste_body: 3,
        taste_sweetness: 3,
        taste_finish: 3,
        overall_rating: 0,
        notes: '',
      }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/brews')
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-saddle font-medium">Espresso</p>
        <h1 className="font-serif italic text-4xl text-walnut tracking-tight mt-1">Log a shot</h1>
      </header>

      <Card>
        <Field label="Bean">
          <select value={form.bean_id} onChange={set('bean_id')} className={inputCls} required>
            <option value="">— pick a bean —</option>
            {espressoBeans.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}{b.roaster ? ` · ${b.roaster}` : ''}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Grinder">
            <div className="flex gap-2">
              <Pill active={form.grinder === 'opus2'} onClick={() => set('grinder')('opus2')}>Opus 2</Pill>
              <Pill active={form.grinder === 'breville'} onClick={() => set('grinder')('breville')}>Breville</Pill>
            </div>
          </Field>
          <Field label={form.grinder === 'opus2' ? 'Grind (decimal)' : `Grind (1–${settings.breville_grind_max})`}>
            {form.grinder === 'opus2' ? (
              <input
                type="number"
                step={0.1}
                min={1}
                max={10}
                value={form.grind_decimal}
                onChange={setNum('grind_decimal')}
                className={inputCls + ' tabular-nums'}
              />
            ) : (
              <input
                type="number"
                step={1}
                min={settings.breville_grind_min}
                max={settings.breville_grind_max}
                value={form.grind_integer}
                onChange={setNum('grind_integer')}
                className={inputCls + ' tabular-nums'}
              />
            )}
          </Field>
        </div>
      </Card>

      <Card title="Shot">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Dose (g)">
            <input type="number" step={0.1} min={0} value={form.dose_grams} onChange={setNum('dose_grams')} className={inputCls + ' tabular-nums'} />
          </Field>
          <Field label="Yield (g)">
            <input type="number" step={0.1} min={0} value={form.yield_grams} onChange={setNum('yield_grams')} className={inputCls + ' tabular-nums'} />
          </Field>
          <Field label="Ratio">
            <div className="px-3 py-2 rounded-lg bg-cream-soft border border-walnut/10 text-walnut tabular-nums">
              {formatRatio(currentRatio)} <span className="text-camel text-sm">(target 1:2.00)</span>
            </div>
          </Field>
        </div>

        <Field label="Extraction time">
          <Stopwatch value={form.extraction_time_sec} onChange={set('extraction_time_sec')} />
          <p className="text-xs text-camel mt-1">Target 25–30s</p>
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.pressure_ok}
            onChange={(e) => set('pressure_ok')(e.target.checked)}
            className="w-4 h-4 accent-saddle"
          />
          <span className="text-sm text-walnut">Pressure gauge in range</span>
        </label>
      </Card>

      <Card title="Taste">
        <TasteSliders
          values={form}
          onChange={(v) => setForm((f) => ({ ...f, ...v }))}
        />
      </Card>

      <Card title="Overall">
        <Stars value={form.overall_rating} onChange={set('overall_rating')} size="lg" />
        <Field label="Notes">
          <textarea
            rows={3}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Dialed in, slightly long..."
            className={inputCls}
          />
        </Field>
      </Card>

      {hints.length > 0 && (
        <div className="bg-camel/15 border border-camel/30 rounded-2xl p-5 space-y-1">
          <div className="text-xs uppercase tracking-[0.2em] text-saddle font-medium mb-1">Next shot</div>
          {hints.map((h, i) => (
            <p key={i} className="text-sm text-walnut">→ {h.text}</p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 sticky bottom-0 bg-cream/95 backdrop-blur py-4 -mx-4 px-4 border-t border-walnut/10">
        <button
          onClick={() => save({ clone: false })}
          className="px-6 py-2.5 bg-walnut text-cream-pale rounded-full font-medium hover:bg-saddle"
        >
          Save
        </button>
        <button
          onClick={() => save({ clone: true })}
          className="px-6 py-2.5 bg-ebony text-cream-pale rounded-full font-medium hover:bg-charcoal"
        >
          Save & Clone
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 text-toffee rounded-full hover:bg-cream-soft"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 border border-walnut/20 rounded-lg bg-cream-pale text-walnut focus:outline-none focus:ring-2 focus:ring-saddle/40 focus:border-saddle'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-walnut mb-1">{label}</span>
      {children}
    </label>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-cream-pale rounded-2xl border border-walnut/10 p-6 space-y-4">
      {title && <h2 className="text-xs uppercase tracking-[0.2em] text-camel font-medium">{title}</h2>}
      {children}
    </div>
  )
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
        active
          ? 'bg-walnut text-cream-pale'
          : 'bg-cream-soft text-walnut/80 hover:bg-cream'
      }`}
    >
      {children}
    </button>
  )
}
