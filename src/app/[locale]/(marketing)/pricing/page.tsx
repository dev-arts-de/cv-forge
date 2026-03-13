'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Zap, Check, ArrowRight, Brain, Wand2, ShieldCheck, Clock, RefreshCw } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'
import CreditsPurchaseModal from '@/components/shared/CreditsPurchaseModal'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 5,
    price: '1,99',
    perCredit: '0,40',
    analyses: 1,
    letters: 2,
    highlight: false,
    desc: 'Zum Reinschnuppern',
  },
  {
    id: 'standard',
    name: 'Standard',
    credits: 15,
    price: '4,99',
    perCredit: '0,33',
    analyses: 5,
    letters: 7,
    highlight: true,
    desc: 'Am beliebtesten',
    badge: 'Beliebt',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 35,
    price: '9,99',
    perCredit: '0,29',
    analyses: 11,
    letters: 17,
    highlight: false,
    desc: 'Für intensive Bewerbungsphasen',
    badge: 'Bestes Angebot',
  },
]

const TOOLS = [
  {
    icon: Brain,
    name: 'Talentblick — CV-Analyse',
    desc: 'KI analysiert deinen Lebenslauf auf Stärken, Schwächen und ATS-Kompatibilität.',
    cost: 3,
    color: 'text-primary',
    bg: 'bg-primary/8',
  },
  {
    icon: Wand2,
    name: 'Anschreibomat',
    desc: 'Generiert ein personalisiertes Anschreiben passend zu dir und der Stellenanzeige.',
    cost: 2,
    color: 'text-accent-orange',
    bg: 'bg-accent-orange/8',
  },
]

const TRUST = [
  { icon: ShieldCheck, label: 'SSL-verschlüsselt' },
  { icon: Zap,         label: 'Sofortige Gutschrift' },
  { icon: Clock,       label: 'Kein Abo, kein Risiko' },
  { icon: RefreshCw,   label: 'Credits verfallen nicht' },
]

export default function PricingPage() {
  const locale = useLocale()
  const { data: session } = useSession()
  const { balance, addCredits } = useCredits()
  const [modalOpen, setModalOpen] = useState(false)
  const [preselect, setPreselect] = useState<string | null>(null)

  function openModal(id?: string) {
    setPreselect(id ?? null)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="perf-orb absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="perf-orb absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent-teal/4 blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="text-center mb-16"
        >
          <h1 className="font-syne font-bold text-4xl sm:text-5xl text-foreground mb-4 tracking-tight">
            Einfach und transparent
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto leading-relaxed">
            Kauf nur was du brauchst. Keine Abos, keine versteckten Kosten — Credits verfallen nie.
          </p>
          {!session?.user && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7"
            >
              <Link
                href={`/${locale}/auth?mode=register`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-colors"
              >
                Kostenlos starten
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted mt-2">Jeder Account startet mit 6 kostenlosen Credits</p>
            </motion.div>
          )}
          {session?.user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-2xl bg-surface-2 border border-border text-sm font-medium text-foreground"
            >
              <Zap className="w-4 h-4 text-primary" />
              Dein Guthaben: <span className="font-bold">{balance} Credits</span>
            </motion.div>
          )}
        </motion.div>

        {/* What costs what */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-5 text-center">Was kostet was</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <div
                  key={tool.name}
                  className="flex items-start gap-4 px-5 py-4 rounded-2xl border border-border bg-white"
                >
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', tool.bg)}>
                    <Icon className={cn('w-4 h-4', tool.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-syne font-semibold text-sm text-foreground mb-0.5">{tool.name}</p>
                    <p className="text-xs text-muted leading-relaxed">{tool.desc}</p>
                  </div>
                  <div className={cn('flex items-center gap-1 px-2.5 py-1.5 rounded-xl flex-shrink-0', tool.bg)}>
                    <Zap className={cn('w-3 h-3', tool.color)} />
                    <span className={cn('text-xs font-bold', tool.color)}>{tool.cost}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Packages */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-5 text-center">Credits kaufen</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06, type: 'spring', stiffness: 280, damping: 26 }}
                className={cn(
                  'relative flex flex-col rounded-2xl border p-6',
                  pkg.highlight
                    ? 'border-foreground/20 bg-white shadow-lg'
                    : 'border-border bg-white shadow-sm'
                )}
              >
                {pkg.badge && (
                  <div className={cn(
                    'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap',
                    pkg.highlight
                      ? 'bg-foreground text-white'
                      : 'bg-surface-2 text-muted border border-border'
                  )}>
                    {pkg.badge}
                  </div>
                )}

                {/* Name + desc */}
                <div className="mb-5">
                  <p className="font-syne font-bold text-base text-foreground">{pkg.name}</p>
                  <p className="text-xs text-muted mt-0.5">{pkg.desc}</p>
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="font-syne font-black text-4xl text-foreground tracking-tight">{pkg.price}</span>
                  <span className="text-lg text-muted ml-1">€</span>
                </div>
                <p className="text-xs text-muted mb-5">{pkg.perCredit} € pro Credit</p>

                {/* Credits badge */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-border">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-sm text-foreground">{pkg.credits} Credits</span>
                  </div>
                </div>

                {/* What you get */}
                <ul className="space-y-2 mb-6 flex-1">
                  {[
                    `${pkg.analyses} CV-${pkg.analyses === 1 ? 'Analyse' : 'Analysen'}`,
                    `${pkg.letters} Anschreiben`,
                    'Kein Ablaufdatum',
                    'Einmalige Zahlung',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted">
                      <Check className="w-3.5 h-3.5 text-status-green flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => openModal(pkg.id)}
                  className={cn(
                    'w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                    pkg.highlight
                      ? 'bg-foreground text-white hover:bg-foreground/90'
                      : 'bg-surface-2 text-foreground hover:bg-surface-3 border border-border'
                  )}
                >
                  {pkg.credits} Credits kaufen
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-muted"
        >
          {TRUST.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      <AppFooter />

      {modalOpen && (
        <CreditsPurchaseModal
          currentBalance={balance}
          onClose={() => setModalOpen(false)}
          onSuccess={(newBalance) => {
            addCredits(newBalance - balance)
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
