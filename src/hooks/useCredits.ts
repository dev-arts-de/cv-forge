'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

const CREDIT_COSTS = { analysis: 3, cover_letter: 2 } as const
export type CreditAction = keyof typeof CREDIT_COSTS

export function useCredits() {
  const { data: session, update } = useSession()
  const [balance, setBalance] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Seed from JWT on session change
  useEffect(() => {
    if (session?.user) {
      setBalance((session.user as { credits?: number }).credits ?? 0)
    }
  }, [session])

  // Always fetch fresh from DB after mount to correct any stale JWT
  useEffect(() => {
    if (!mounted) return
    fetch('/api/credits')
      .then((r) => r.ok ? r.json() : null)
      .then((data: { credits: number } | null) => {
        if (data && typeof data.credits === 'number') {
          setBalance(data.credits)
          update({ credits: data.credits })
        }
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  const canAfford = useCallback(
    (action: CreditAction) => balance >= CREDIT_COSTS[action],
    [balance]
  )

  const spend = useCallback(
    async (action: CreditAction): Promise<boolean> => {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json() as { credits?: number }
      // Update balance regardless of success/failure — DB is always source of truth
      if (typeof data.credits === 'number') {
        setBalance(data.credits)
        update({ credits: data.credits })
      }
      return res.ok
    },
    [update]
  )

  const refund = useCallback(
    async (action: CreditAction): Promise<void> => {
      try {
        const res = await fetch('/api/credits', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        })
        const data = await res.json() as { credits?: number }
        if (typeof data.credits === 'number') {
          setBalance(data.credits)
          update({ credits: data.credits })
        }
      } catch {
        // Refund failed silently — balance will be corrected on next fetch
      }
    },
    [update]
  )

  const addCredits = useCallback((amount: number) => {
    fetch('/api/credits')
      .then((r) => r.ok ? r.json() : null)
      .then((data: { credits: number } | null) => {
        if (data && typeof data.credits === 'number') {
          setBalance(data.credits)
          update({ credits: data.credits })
        }
      })
      .catch(() => {
        setBalance((prev) => prev + amount)
      })
  }, [update])

  // Poll until credits increase — used after Stripe redirect
  const pollUntilUpdated = useCallback((knownBalance: number, onUpdated: (newBalance: number) => void) => {
    let attempts = 0
    const MAX = 12 // max 12 × 2.5s = 30s

    const poll = () => {
      attempts++
      fetch('/api/credits')
        .then((r) => r.ok ? r.json() : null)
        .then((data: { credits: number } | null) => {
          if (data && data.credits > knownBalance) {
            setBalance(data.credits)
            update({ credits: data.credits })
            onUpdated(data.credits)
          } else if (attempts < MAX) {
            setTimeout(poll, 2500)
          }
        })
        .catch(() => {
          if (attempts < MAX) setTimeout(poll, 2500)
        })
    }

    setTimeout(poll, 1000)
  }, [update])

  return {
    balance: mounted ? balance : 0,
    setBalance,
    canAfford,
    spend,
    refund,
    addCredits,
    pollUntilUpdated,
    costs: CREDIT_COSTS,
    mounted,
  }
}
