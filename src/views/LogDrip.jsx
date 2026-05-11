import { useMemo, useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { navigate } from '../hooks/useHashRoute.js'
import Stars from '../components/Stars.jsx'
import TasteSliders from '../components/TasteSliders.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { dripAdjustmentHints, formatRatio, ratio } from '../utils/brew.js'

function defaultForm(activeBeanId) {
  return {
    bean_id: activeBeanId || '',
    grinder: 'opus1',
    grind_outer: 6.0,
    grind_inner: 0,
    coffee_dose_grams: 20,
    water_grams: 320,
    bloom_time_sec: '',
    total_brew_time_sec: '',
    taste_balance: 0,
    taste_body: 3,
    taste_sweetness: 3,
    taste_finish: 3,
    overall_rating: 0,
    notes: '',
  }
}

export default function LogDrip({ cloneId }) {
  const { beans, brews, settings, addBrew } = useData()

  const cloneFrom = useMemo(() => {
    if (cloneId) return brews.find((b) => b.id === cloneId)
    return brews.find((b) => b.brew_method === 'drip')
  }, [brews, cloneId])

  const [form, setForm] = useState(() => {
    const base = defaultForm(settings.active_drip_bean_id)
    if (cloneFrom) {
      return {
        ...base,
        bean_id: cloneFrom.bean_id,
        grind_outer: cloneFrom.grind_outer ?? base.grind_outer,
        grind_inner: cloneFrom.grind_inner ?? base.grind_inner,
        coffee_dose_grams: cloneFrom.coffee_dose_grams ?? base.coffee_dose_grams,
        water_grams: cloneFrom.water_grams ?? base.water_grams,
      }
    }
    return base
  })

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }))
  const setNum = (k) => (e) => {
    const val = e.target.value
    setForm((f) => ({ ...f, [k]: val === '' ? '' : Number(val) }))
  }

  const dripBeans = useMemo(() => beans.filter((b) => b.status !== 'finished'), [beans])
  const currentRatio = ratio(form.water_grams, form.coffee_dose_grams)
  const hints = dripAdjustmentHints(form)

  if (dripBeans.length === 0) {
    return (
      <EmptyState
        title="No active beans"
        message="Add a bean before logging a brew."
        action={
          <button
            onClick={() => navigate('/beans')}
            className="px-5 py-2.5 bg-olive text-cream-pale rounded-full font-medium hover:bg-ebony"
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
      brew_method: 'drip',
      grinder: 'opus1',
      grind_outer: Number(form.grind_outer),
      grind_inner: Number(form.grind_inner) || 0,
      coffee_dose_grams: Number(form.coffee_dose_grams) || null,
      water_grams: Number(form.water_grams) || null,
      brew_ratio: currentRatio,
      bloom_time_sec: form.bloom_time_sec === '' ? null : Number(form.bloom_time_sec),
      total_brew_time_sec: form.total_brew_time_sec === '' ? null : Number(form.total_brew_time_sec),
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
        bloom_time_sec: '',
        total_brew_time_sec: '',
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
        <p className="text-xs uppercase tracking-[0.2em] text-olive font-medium">Drip</p>
        <h1 className="font-serif italic text-4xl text-walnut tracking-tight mt-1">Brew a cup</h1>
        <p className="text-toffee text-sm mt-1">Fellow Aiden + Opus (drip)</p>
      </header>

      <Card>
        <Field label="Bean">
          <select value={form.bean_id} onChange={set('bean_id')} className={inputCls} required>
            <option value="">— pick a bean —</option>
            {dripBeans.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}{b.roaster ? ` · ${b.roaster}` : ''}
              </option>
            ))}
          </select>
        </Field>
      </Card>

      <Card title="Grind (Opus drip)">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Outer ring (1.00–11.00, step 0.25)">
            <input
              type="number"
              min={1}
              max={11}
              step={0.25}
              value={form.grind_outer}
              onChange={setNum('grind_outer')}
              className={inputCls + ' tabular-nums'}
            />
          </Field>
          <Field label="Inner ring (0–3 clicks)">
            <input
              type="number"
              min={0}
              max={3}
              step={1}
              value={form.grind_inner}
              onChange={setNum('grind_inner')}
              className={inputCls + ' tabular-nums'}
            />
          </Field>
        </div>
        <p className="text-xs text-camel">
          Setting: <span className="font-medium text-walnut tabular-nums">{Number(form.grind_outer).toFixed(2)} + {form.grind_inner || 0}</span>
        </p>
      </Card>

      <Card title="Brew">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Coffee (g)">
            <input type="number" step={0.1} min={0} value={form.coffee_dose_grams} onChange={setNum('coffee_dose_grams')} className={inputCls + ' tabular-nums'} />
          </Field>
          <Field label="Water (g)">
            <input type="number" step={1} min={0} value={form.water_grams} onChange={setNum('water_grams')} className={inputCls + ' tabular-nums'} />
          </Field>
          <Field label="Ratio">
            <div className="px-3 py-2 rounded-lg bg-cream-soft border border-walnut/10 text-walnut tabular-nums">
              {formatRatio(currentRatio)}
            </div>
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Bloom (sec) — optional">
            <input
              type="number"
              min={0}
              step={1}
              value={form.bloom_time_sec}
              onChange={setNum('bloom_time_sec')}
              placeholder="45"
              className={inputCls + ' tabular-nums'}
            />
          </Field>
          <Field label="Total brew time (sec)">
            <input
              type="number"
              min={0}
              step={1}
              value={form.total_brew_time_sec}
              onChange={setNum('total_brew_time_sec')}
              placeholder="210"
              className={inputCls + ' tabular-nums'}
            />
          </Field>
        </div>
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
          <textarea rows={3} value={form.notes} onChange={set('notes')} className={inputCls} />
        </Field>
      </Card>

      {hints.length > 0 && (
        <div className="bg-sage-light/30 border border-sage/40 rounded-2xl p-5 space-y-1">
          <div className="text-xs uppercase tracking-[0.2em] text-olive font-medium mb-1">Next brew</div>
          {hints.map((h, i) => (
            <p key={i} className="text-sm text-walnut">→ {h.text}</p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 sticky bottom-0 bg-cream/95 backdrop-blur py-4 -mx-4 px-4 border-t border-walnut/10">
        <button onClick={() => save({ clone: false })} className="px-6 py-2.5 bg-olive text-cream-pale rounded-full font-medium hover:bg-ebony">
          Save
        </button>
        <button onClick={() => save({ clone: true })} className="px-6 py-2.5 bg-ebony text-cream-pale rounded-full font-medium hover:bg-charcoal">
          Save & Clone
        </button>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 text-toffee rounded-full hover:bg-cream-soft">
          Cancel
        </button>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 border border-walnut/20 rounded-lg bg-cream-pale text-walnut focus:outline-none focus:ring-2 focus:ring-olive/40 focus:border-olive'

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
