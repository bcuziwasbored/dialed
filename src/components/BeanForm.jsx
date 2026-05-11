import { useState } from 'react'
import { todayIso } from '../utils/dates.js'

const EMPTY = {
  name: '',
  roaster: '',
  origin: '',
  process: '',
  roast_level: 'medium',
  roast_date: '',
  purchase_date: todayIso(),
  weight_grams: '',
  roaster_notes: '',
  status: 'active',
  personal_rating: 0,
  notes: '',
}

export default function BeanForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...initial }))
  const set = (k) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [k]: value }))
  }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({
      ...form,
      weight_grams: form.weight_grams === '' ? null : Number(form.weight_grams),
      personal_rating: Number(form.personal_rating) || 0,
    })
  }

  return (
    <form onSubmit={submit} className="bg-cream-pale rounded-2xl border border-walnut/10 p-6 space-y-4">
      <h3 className="font-serif text-xl text-walnut">{initial?.id ? 'Edit bean' : 'Add bean'}</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name *">
          <input
            required
            value={form.name}
            onChange={set('name')}
            placeholder="Streamline Blend"
            className={inputCls}
          />
        </Field>
        <Field label="Roaster">
          <input
            value={form.roaster}
            onChange={set('roaster')}
            placeholder="Olympia Coffee"
            className={inputCls}
            list="roaster-suggestions"
          />
          <datalist id="roaster-suggestions">
            <option value="Olympia Coffee" />
          </datalist>
        </Field>
        <Field label="Origin">
          <input value={form.origin} onChange={set('origin')} placeholder="Ethiopia" className={inputCls} />
        </Field>
        <Field label="Process">
          <input value={form.process} onChange={set('process')} placeholder="Washed" className={inputCls} />
        </Field>
        <Field label="Roast level">
          <select value={form.roast_level} onChange={set('roast_level')} className={inputCls}>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="medium-dark">Medium-dark</option>
            <option value="dark">Dark</option>
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={set('status')} className={inputCls}>
            <option value="active">Active</option>
            <option value="resting">Resting</option>
            <option value="finished">Finished</option>
          </select>
        </Field>
        <Field label="Roast date">
          <input type="date" value={form.roast_date} onChange={set('roast_date')} className={inputCls} />
        </Field>
        <Field label="Purchase date">
          <input type="date" value={form.purchase_date} onChange={set('purchase_date')} className={inputCls} />
        </Field>
        <Field label="Weight (g)">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={form.weight_grams}
            onChange={set('weight_grams')}
            placeholder="250"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Roaster notes">
        <textarea
          rows={2}
          value={form.roaster_notes}
          onChange={set('roaster_notes')}
          placeholder="Stone fruit, jasmine, bright acidity"
          className={inputCls}
        />
      </Field>

      <Field label="My notes">
        <textarea rows={2} value={form.notes} onChange={set('notes')} className={inputCls} />
      </Field>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="px-5 py-2.5 bg-walnut text-cream-pale rounded-full font-medium hover:bg-saddle"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-toffee rounded-full hover:bg-cream-soft"
        >
          Cancel
        </button>
      </div>
    </form>
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
