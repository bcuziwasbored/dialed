export const STORAGE_KEYS = {
  beans: 'cdl_beans',
  brews: 'cdl_brews',
  settings: 'cdl_settings',
}

export const DEFAULT_SETTINGS = {
  breville_grind_min: 1,
  breville_grind_max: 16,
  active_espresso_bean_id: null,
  active_drip_bean_id: null,
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getBeans = () => read(STORAGE_KEYS.beans, [])
export const getBrews = () => read(STORAGE_KEYS.brews, [])
export const getSettings = () => ({ ...DEFAULT_SETTINGS, ...read(STORAGE_KEYS.settings, {}) })

export const saveBeans = (beans) => write(STORAGE_KEYS.beans, beans)
export const saveBrews = (brews) => write(STORAGE_KEYS.brews, brews)
export const saveSettings = (settings) => write(STORAGE_KEYS.settings, settings)

export function exportAll() {
  return {
    version: 1,
    exported_at: new Date().toISOString(),
    beans: getBeans(),
    brews: getBrews(),
    settings: getSettings(),
  }
}

export function importAll(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid import payload')
  }
  if (Array.isArray(payload.beans)) saveBeans(payload.beans)
  if (Array.isArray(payload.brews)) saveBrews(payload.brews)
  if (payload.settings && typeof payload.settings === 'object') {
    saveSettings({ ...DEFAULT_SETTINGS, ...payload.settings })
  }
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEYS.beans)
  localStorage.removeItem(STORAGE_KEYS.brews)
  localStorage.removeItem(STORAGE_KEYS.settings)
}

export function downloadExport(filename = `dialed-export-${new Date().toISOString().slice(0, 10)}.json`) {
  const data = exportAll()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
