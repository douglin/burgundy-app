import { useCallback, useEffect, useState } from 'react'
import initialLog from '../tasting-log/log.json'

const STORAGE_KEY = 'burgundy-tasting-log'

export function useLog() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialLog
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const addEntry = useCallback((entry) => {
    const newEntry = { ...entry, id: crypto.randomUUID() }
    setEntries((prev) => [newEntry, ...prev])
    return newEntry.id
  }, [])

  const updateEntry = useCallback((id, changes) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...changes } : e))
    )
  }, [])

  const deleteEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry }
}
