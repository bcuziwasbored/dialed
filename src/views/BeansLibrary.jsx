import { useMemo, useState } from 'react'
import { useData } from '../contexts/DataContext.jsx'
import BeanCard from '../components/BeanCard.jsx'
import BeanForm from '../components/BeanForm.jsx'
import EmptyState from '../components/EmptyState.jsx'

const FILTERS = ['all', 'active', 'resting', 'finished']

export default function BeansLibrary() {
  const { beans, brews, settings, addBean, updateBean, deleteBean, setSettings } = useData()
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)

  const brewCounts = useMemo(() => {
    const counts = {}
    for (const brew of brews) counts[brew.bean_id] = (counts[brew.bean_id] || 0) + 1
    return counts
  }, [brews])

  const filtered = useMemo(() => {
    const list = filter === 'all' ? beans : beans.filter((b) => b.status === filter)
    return [...list].sort((a, b) => {
      const order = { active: 0, resting: 1, finished: 2 }
      const sa = order[a.status] ?? 3
      const sb = order[b.status] ?? 3
      if (sa !== sb) return sa - sb
      return (b.roast_date || '').localeCompare(a.roast_date || '')
    })
  }, [beans, filter])

  function handleSave(beanData) {
    if (editing?.id) {
      updateBean(editing.id, beanData)
    } else {
      addBean(beanData)
    }
    setEditing(null)
  }

  function handleDelete(bean) {
    if (confirm(`Delete "${bean.name}"? This won't delete its brew history.`)) {
      deleteBean(bean.id)
    }
  }

  function setActive(bean, method) {
    const key = method === 'espresso' ? 'active_espresso_bean_id' : 'active_drip_bean_id'
    const currentlyActive = settings[key] === bean.id
    setSettings({ [key]: currentlyActive ? null : bean.id })
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-serif italic text-4xl text-stone-900 tracking-tight">Beans</h1>
        {!editing && (
          <button
            onClick={() => setEditing({})}
            className="px-5 py-2.5 bg-amber-800 text-white rounded-full font-medium hover:bg-amber-900 shadow-sm"
          >
            + Add bean
          </button>
        )}
      </header>

      {editing && (
        <BeanForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize font-medium transition-colors ${
              filter === f
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-white/80 border border-stone-300/70 text-stone-700 hover:bg-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={beans.length === 0 ? 'No beans yet' : `No ${filter} beans`}
          message={beans.length === 0 ? 'Add your first bag to start logging brews.' : null}
          action={
            beans.length === 0 && !editing ? (
              <button
                onClick={() => setEditing({})}
                className="px-5 py-2.5 bg-amber-800 text-white rounded-full font-medium hover:bg-amber-900 shadow-sm"
              >
                + Add bean
              </button>
            ) : null
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((bean) => (
            <BeanCard
              key={bean.id}
              bean={bean}
              brewCount={brewCounts[bean.id] || 0}
              onEdit={() => setEditing(bean)}
              onDelete={() => handleDelete(bean)}
              onSetActive={(method) => setActive(bean, method)}
              isActiveEspresso={settings.active_espresso_bean_id === bean.id}
              isActiveDrip={settings.active_drip_bean_id === bean.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
