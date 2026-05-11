import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/storage.js'
import { uid } from '../utils/id.js'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [beans, setBeans] = useLocalStorage(STORAGE_KEYS.beans, [])
  const [brews, setBrews] = useLocalStorage(STORAGE_KEYS.brews, [])
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)

  const actions = useMemo(() => ({
    addBean(bean) {
      const newBean = { ...bean, id: uid() }
      setBeans((prev) => [newBean, ...prev])
      return newBean
    },
    updateBean(id, updates) {
      setBeans((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
    },
    deleteBean(id) {
      setBeans((prev) => prev.filter((b) => b.id !== id))
      setSettings((prev) => ({
        ...prev,
        active_espresso_bean_id: prev.active_espresso_bean_id === id ? null : prev.active_espresso_bean_id,
        active_drip_bean_id: prev.active_drip_bean_id === id ? null : prev.active_drip_bean_id,
      }))
    },
    addBrew(brew) {
      const newBrew = {
        ...brew,
        id: uid(),
        timestamp: brew.timestamp || new Date().toISOString(),
      }
      setBrews((prev) => [newBrew, ...prev])
      return newBrew
    },
    deleteBrew(id) {
      setBrews((prev) => prev.filter((b) => b.id !== id))
    },
    setSettings(updates) {
      setSettings((prev) => ({ ...prev, ...updates }))
    },
    replaceAll({ beans: b, brews: br, settings: s }) {
      if (Array.isArray(b)) setBeans(b)
      if (Array.isArray(br)) setBrews(br)
      if (s && typeof s === 'object') setSettings({ ...DEFAULT_SETTINGS, ...s })
    },
    clearAll() {
      setBeans([])
      setBrews([])
      setSettings(DEFAULT_SETTINGS)
    },
  }), [setBeans, setBrews, setSettings])

  const value = useMemo(() => ({ beans, brews, settings, ...actions }), [beans, brews, settings, actions])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
