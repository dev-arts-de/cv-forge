'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export interface SavedCV {
  id: string
  name: string
  text: string
  createdAt: string
  lastUsedAt: string | null
}

export function useSavedCVs() {
  const { data: session } = useSession()
  const [cvs, setCVs] = useState<SavedCV[]>([])
  const [loading, setLoading] = useState(false)

  const fetch_ = useCallback(async () => {
    if (!session?.user?.id) return
    setLoading(true)
    try {
      const res = await fetch('/api/cvs')
      if (res.ok) {
        const data = await res.json() as { cvs: SavedCV[] }
        setCVs(data.cvs)
      }
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => { fetch_() }, [fetch_])

  const save = useCallback(async (text: string, name?: string): Promise<SavedCV | null> => {
    if (!session?.user?.id) return null
    try {
      const res = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, name }),
      })
      if (!res.ok) return null
      const data = await res.json() as { cv: SavedCV }
      // Update local state: replace if exists, prepend if new
      setCVs(prev => {
        const exists = prev.findIndex(c => c.id === data.cv.id)
        if (exists >= 0) {
          const next = [...prev]
          next[exists] = { ...next[exists], ...data.cv }
          return next
        }
        return [data.cv, ...prev]
      })
      return data.cv
    } catch { return null }
  }, [session?.user?.id])

  const rename = useCallback(async (id: string, name: string) => {
    const res = await fetch(`/api/cvs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      setCVs(prev => prev.map(c => c.id === id ? { ...c, name } : c))
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`/api/cvs/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCVs(prev => prev.filter(c => c.id !== id))
    }
  }, [])

  return { cvs, loading, save, rename, remove, reload: fetch_ }
}
