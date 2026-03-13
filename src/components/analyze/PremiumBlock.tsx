'use client'

import { motion } from 'framer-motion'
import { Lock, Wand2, CheckCheck, Star, Zap, ArrowUpRight } from 'lucide-react'

const FEATURES = [
  { icon: '✏️', title: 'KI-Umschreibung', desc: 'Bullet Points & Formulierungen automatisch verbessern' },
  { icon: '🎯', title: 'Job-Optimierung', desc: 'CV auf eine konkrete Stellenausschreibung zuschneiden' },
  { icon: '📊', title: 'Keyword-Matching', desc: 'Fehlende ATS-Keywords automatisch ergänzen' },
  { icon: '🌍', title: 'Sprachoptimierung', desc: 'Professionellere Sprache & aktive Formulierungen' },
]

// Fake "preview" items that get blurred
const PREVIEW_ITEMS = [
  { original: 'Ich war für die Betreuung von Kunden zuständig', improved: 'Betreute und entwickelte ein Portfolio von 120+ Schlüsselkunden, steigerte die Kundenzufriedenheit um 34%', score: 92 },
  { original: 'Entwicklung von Software', improved: 'Entwickelte skalierbare Full-Stack-Anwendungen mit React & Node.js, die täglich 50.000+ Nutzer bedienen', score: 88 },
  { original: 'Mitarbeit in Projekten', improved: 'Führte cross-funktionale Teams in 3 strategischen Projekten mit einem Gesamtbudget von €1,2M', score: 95 },
]

export default function PremiumBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative rounded-2xl overflow-hidden border border-primary/20"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-accent-sky-light to-accent-peach-light opacity-60" />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 15, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent-sky/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center"
            >
              <Wand2 className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-syne font-bold text-foreground text-lg">CV Optimieren</h2>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.4 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold"
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                  PRO
                </motion.span>
              </div>
              <p className="text-sm text-muted mt-0.5">KI verbessert deinen Lebenslauf automatisch</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-primary hover:shadow-primary-lg transition-all duration-200"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            Freischalten
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="rounded-xl bg-white/70 border border-white/80 p-3 text-center"
            >
              <div className="text-2xl mb-1.5">{f.icon}</div>
              <div className="font-syne font-semibold text-foreground text-xs mb-0.5">{f.title}</div>
              <div className="text-xs text-muted leading-tight">{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Blurred preview */}
        <div className="relative">
          <div className="text-xs font-semibold text-muted mb-2.5 flex items-center gap-1.5">
            <CheckCheck className="w-3.5 h-3.5 text-accent-teal" />
            Beispiel-Optimierungen
          </div>
          <div className="space-y-2 select-none" style={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
            {PREVIEW_ITEMS.map((item, i) => (
              <div key={i} className="rounded-xl bg-white/80 border border-border p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wide">Vorher</span>
                    </div>
                    <p className="text-xs text-muted line-through leading-relaxed">{item.original}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-bold text-accent-teal uppercase tracking-wide">Nachher</span>
                    </div>
                    <p className="text-xs text-foreground/85 leading-relaxed font-medium">{item.improved}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                    <span className="font-mono font-bold text-base text-status-green">{item.score}</span>
                    <span className="text-[9px] text-muted">Score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
              className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-5 border border-border shadow-lg"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"
              >
                <Lock className="w-5 h-5 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="font-syne font-bold text-foreground text-sm">Pro Feature</p>
                <p className="text-xs text-muted mt-0.5">Upgrade um dies freizuschalten</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-primary"
              >
                Jetzt upgraden — €9,99/Monat
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
