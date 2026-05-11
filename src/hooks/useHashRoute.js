import { useEffect, useState } from 'react'

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || '/')
  useEffect(() => {
    const onChange = () => setHash(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export function navigate(path) {
  if (window.location.hash.slice(1) === path) return
  window.location.hash = path
}

export function parseRoute(hash) {
  const [path, qs] = hash.split('?')
  return { path: path || '/', params: new URLSearchParams(qs || '') }
}
