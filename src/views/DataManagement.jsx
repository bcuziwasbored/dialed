import { useRef, useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import { downloadExport } from '../utils/storage.js'

export default function DataManagement() {
  const { beans, brews, settings, replaceAll, clearAll, setSettings } = useData()
  const fileRef = useRef(null)
  const [message, setMessage] = useState(null)
  const [clearStage, setClearStage] = useState(0)

  function handleExport() {
    downloadExport()
    setMessage({ tone: 'ok', text: 'Exported.' })
  }

  function handleImportClick() {
    fileRef.current?.click()
  }

  async function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!data || typeof data !== 'object') throw new Error('Invalid file')
      if (!Array.isArray(data.beans) && !Array.isArray(data.brews)) {
        throw new Error('No beans or brews in this file')
      }
      if (!confirm(`Import ${data.beans?.length ?? 0} beans and ${data.brews?.length ?? 0} brews? This replaces your current data.`)) {
        e.target.value = ''
        return
      }
      replaceAll(data)
      setMessage({ tone: 'ok', text: 'Imported.' })
    } catch (err) {
      setMessage({ tone: 'error', text: `Import failed: ${err.message}` })
    }
    e.target.value = ''
  }

  function handleClear() {
    if (clearStage === 0) {
      setClearStage(1)
      setTimeout(() => setClearStage(0), 5000)
      return
    }
    if (clearStage === 1) {
      setClearStage(2)
      setTimeout(() => setClearStage(0), 5000)
      return
    }
    clearAll()
    setClearStage(0)
    setMessage({ tone: 'ok', text: 'All data cleared.' })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif italic text-4xl text-stone-900 tracking-tight">Data</h1>
        <p className="text-stone-500 text-sm mt-1">Back up, restore, and configure.</p>
      </header>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.tone === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <Section title="Backup">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-5 py-2.5 bg-amber-800 text-white rounded-full font-medium hover:bg-amber-900 shadow-sm"
          >
            Export JSON
          </button>
          <button
            onClick={handleImportClick}
            className="px-5 py-2.5 bg-stone-800 text-white rounded-full font-medium hover:bg-stone-900 shadow-sm"
          >
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
        </div>
        <p className="text-xs text-stone-500 mt-2">
          {beans.length} beans · {brews.length} brews in localStorage right now.
        </p>
      </Section>

      <Section title="Breville grinder range">
        <div className="grid sm:grid-cols-2 gap-3 max-w-md">
          <label className="block">
            <span className="block text-sm text-stone-700 mb-1">Min</span>
            <input
              type="number"
              min={1}
              value={settings.breville_grind_min}
              onChange={(e) => setSettings({ breville_grind_min: Number(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white tabular-nums"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-stone-700 mb-1">Max</span>
            <input
              type="number"
              min={1}
              value={settings.breville_grind_max}
              onChange={(e) => setSettings({ breville_grind_max: Number(e.target.value) || 16 })}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white tabular-nums"
            />
          </label>
        </div>
      </Section>

      <Section title="Danger zone">
        <button
          onClick={handleClear}
          className={`px-5 py-2.5 rounded-full font-medium text-white shadow-sm ${
            clearStage === 0
              ? 'bg-stone-600 hover:bg-stone-700'
              : clearStage === 1
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-rose-800 hover:bg-rose-900'
          }`}
        >
          {clearStage === 0 ? 'Clear all data' : clearStage === 1 ? 'Click again to confirm' : 'One more time to wipe everything'}
        </button>
        <p className="text-xs text-stone-500 mt-2">
          This deletes all beans, brews, and settings from your browser. Export first if you want a backup.
        </p>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-6 space-y-3">
      <h2 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">{title}</h2>
      {children}
    </section>
  )
}
