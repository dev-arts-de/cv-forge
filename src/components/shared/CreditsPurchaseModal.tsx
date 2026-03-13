'use client'

import { useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Check, Lock, Loader2, ShieldCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PackageId } from '@/lib/stripe'

const PACKAGES: {
  id: PackageId
  label: string
  credits: number
  price: string
  perCredit: string
  analyses: number
  letters: number
  badge?: string
  highlight?: boolean
}[] = [
  {
    id: 'starter',
    label: 'Starter',
    credits: 5,
    price: '1,99 €',
    perCredit: '0,40 € / Credit',
    analyses: 1,
    letters: 2,
  },
  {
    id: 'standard',
    label: 'Standard',
    credits: 15,
    price: '4,99 €',
    perCredit: '0,33 € / Credit',
    analyses: 5,
    letters: 7,
    badge: 'Beliebt',
    highlight: true,
  },
  {
    id: 'pro',
    label: 'Pro',
    credits: 35,
    price: '9,99 €',
    perCredit: '0,29 € / Credit',
    analyses: 11,
    letters: 17,
    badge: 'Bestes Angebot',
  },
]

interface CreditsPurchaseModalProps {
  onClose: () => void
  onSuccess: (newBalance: number) => void
  currentBalance: number
}

export default function CreditsPurchaseModal({ onClose, currentBalance }: CreditsPurchaseModalProps) {
  useScrollLock()
  const [selected, setSelected] = useState<PackageId>('standard')
  const [loading, setLoading] = useState(false)

  const selectedPkg = PACKAGES.find((p) => p.id === selected)!

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selected }),
      })
      if (!res.ok) throw new Error()
      const { url } = await res.json() as { url: string }
      window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm touch-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 38 }}
        className="relative w-full bg-white shadow-2xl overflow-hidden rounded-t-3xl sm:rounded-2xl sm:max-w-md flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key="form" className="flex flex-col flex-1">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-syne font-bold text-base text-foreground">Credits aufladen</p>
                <p className="text-xs text-muted mt-0.5">
                  Guthaben: <span className="font-semibold text-foreground">{currentBalance}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-surface-2 flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 pb-5 space-y-4 overflow-y-auto overscroll-contain touch-pan-y">
              {/* Package selection */}
              <div className="space-y-2">
                {PACKAGES.map((pkg) => {
                  const isSelected = selected === pkg.id
                  return (
                    <motion.button
                      key={pkg.id}
                      onClick={() => setSelected(pkg.id)}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 text-left',
                        isSelected
                          ? pkg.highlight
                            ? 'border-primary bg-primary/[0.04]'
                            : 'border-foreground/20 bg-surface-2/60'
                          : 'border-border bg-white hover:border-border/80'
                      )}
                    >
                      {/* Radio */}
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                          isSelected
                            ? pkg.highlight
                              ? 'border-primary bg-primary'
                              : 'border-foreground bg-foreground'
                            : 'border-border'
                        )}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-syne font-bold text-sm text-foreground">{pkg.label}</span>
                          {pkg.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                pkg.highlight
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-surface-3 text-muted border border-border'
                              )}
                            >
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted">
                          {pkg.analyses} Analysen · {pkg.letters} Anschreiben
                        </p>
                      </div>

                      {/* Price + credits */}
                      <div className="text-right flex-shrink-0 space-y-0.5">
                        <div className="flex items-center gap-1 justify-end">
                          <Zap className="w-3 h-3 text-primary" />
                          <span className="font-syne font-black text-sm text-foreground">{pkg.credits}</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{pkg.price}</p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-1 text-[11px] text-muted">
                  <Lock className="w-3 h-3" />
                  Sichere Zahlung via Stripe
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* CTA */}
              <motion.button
                onClick={handlePurchase}
                disabled={loading}
                whileHover={!loading ? { scale: 1.015, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className={cn(
                  'w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                  !loading
                    ? 'bg-foreground text-white hover:bg-foreground/90 shadow-sm'
                    : 'bg-surface-3 text-muted cursor-not-allowed'
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Weiterleitung zu Stripe…
                  </>
                ) : (
                  <>
                    {selectedPkg.credits} Credits kaufen
                    <span className="ml-1 opacity-60">·</span>
                    {selectedPkg.price}
                  </>
                )}
              </motion.button>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-muted pb-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  SSL
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Stripe gesichert
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Kein Abo
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
