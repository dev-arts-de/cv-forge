'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'
import { ArrowLeft, Globe, Layout, Star, Sparkles, Check, Mail } from 'lucide-react'
import { useState } from 'react'

export default function FoxfolioPage() {
  const locale = useLocale()
  const [logoError, setLogoError] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleWaitlist = async () => {
    if (!email.trim() || submitted) return
    setSubmitting(true)
    // Fire-and-forget — no backend needed yet, just UX feedback
    await new Promise(r => setTimeout(r, 600))
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="perf-orb absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent-sky/8 blur-[100px]" />
        <div className="perf-orb absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Link
          href={`/${locale}/app/analyze`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Analyse
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 mx-auto mb-6"
          >
            {!logoError ? (
              <Image
                src="/Foxfolio-logo500x500.png"
                alt="Foxfolio"
                width={60}
                height={60}
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Globe className="w-8 h-8 text-accent-sky" />
            )}
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-sky/10 border border-accent-sky/20 text-accent-sky text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Demnächst verfügbar
          </div>

          <h1 className="font-syne font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Foxfolio
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed mb-10">
            Erstelle deine eigene professionelle Portfolio-Seite und mache dich online auffindbar — mit Projekten, Lebenslauf und Referenzen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            {[
              { icon: Layout, label: 'Eigene Domain', desc: 'Dein Portfolio unter deinem Namen' },
              { icon: Star, label: 'Projekte showcasen', desc: 'Zeige was du wirklich drauf hast' },
              { icon: Globe, label: 'Online auffindbar', desc: 'Werde von Recruitern gefunden' },
            ].map((feat, i) => {
              const Icon = feat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="rounded-2xl border border-border bg-white p-5 text-center shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-sky/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-accent-sky" />
                  </div>
                  <p className="font-syne font-semibold text-sm text-foreground mb-1">{feat.label}</p>
                  <p className="text-xs text-muted">{feat.desc}</p>
                </motion.div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {!waitlistOpen ? (
              <motion.button
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setWaitlistOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-accent-sky text-white font-semibold text-sm shadow-lg shadow-accent-sky/30 hover:shadow-accent-sky/50 transition-shadow"
              >
                Vormerken — Bald verfügbar
              </motion.button>
            ) : submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-status-green/15 flex items-center justify-center">
                  <Check className="w-6 h-6 text-status-green" />
                </div>
                <p className="font-syne font-semibold text-foreground">Du bist vorgemerkt!</p>
                <p className="text-xs text-muted">Wir melden uns, sobald Foxfolio startet.</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="flex flex-col sm:flex-row items-stretch gap-2 w-full max-w-sm mx-auto"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleWaitlist()}
                    placeholder="deine@email.de"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-sky/30 focus:border-accent-sky/50 transition-all"
                  />
                </div>
                <motion.button
                  onClick={handleWaitlist}
                  disabled={!email.trim() || submitting}
                  whileHover={email.trim() ? { scale: 1.03 } : {}}
                  whileTap={email.trim() ? { scale: 0.97 } : {}}
                  className="px-5 py-3 rounded-xl bg-accent-sky text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent-sky/25 transition-all"
                >
                  {submitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mx-auto" />
                  ) : 'Eintragen'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AppFooter />
    </div>
  )
}
