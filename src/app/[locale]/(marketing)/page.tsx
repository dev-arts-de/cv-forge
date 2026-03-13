'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  ArrowRight, FileText, Layout, Mail,
  Upload, Zap, TrendingUp,
  Shield, Target, CheckCircle2, AlertCircle,
} from 'lucide-react'
import MarketingNav from '@/components/shared/MarketingNav'
import AppFooter from '@/components/shared/AppFooter'

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-xs mx-auto"
    >
      <div className="bg-white rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.07)] overflow-hidden">

        {/* Fake title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-[#FAFBFF]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
            <div className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          <div className="flex items-center gap-1.5 ml-1 min-w-0">
            <FileText className="w-3 h-3 text-muted flex-shrink-0" />
            <span className="text-[11px] text-muted truncate">Lebenslauf_Analyse.pdf</span>
          </div>
        </div>

        <div className="p-6">
          {/* Score row */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[10px] font-semibold text-muted/60 uppercase tracking-[0.12em] mb-2">
                Gesamtbewertung
              </p>
              <div className="flex items-baseline gap-1.5">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                  className="font-syne font-bold text-[3.25rem] text-foreground tabular-nums leading-none"
                >
                  87
                </motion.span>
                <span className="text-muted text-sm font-light mb-0.5">/ 100</span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 300, damping: 24 }}
              className="px-2.5 py-1 rounded-full bg-status-green-light border border-status-green/20 flex-shrink-0 mt-1"
            >
              <span className="text-[11px] font-semibold text-status-green">Gut</span>
            </motion.div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-surface-2 rounded-full mt-4 mb-5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '87%' }}
              transition={{ delay: 1.0, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-primary rounded-full"
            />
          </div>

          {/* Status items */}
          <div className="flex items-center gap-4">
            {[
              { label: 'ATS-Check', ok: true },
              { label: 'Vollständig', ok: true },
              { label: 'Keywords', ok: false },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-1 text-[11px]">
                {ok
                  ? <CheckCircle2 className="w-3 h-3 text-status-green flex-shrink-0" />
                  : <AlertCircle className="w-3 h-3 text-status-yellow flex-shrink-0" />
                }
                <span className="text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const locale = useLocale()
  const { data: session } = useSession()
  const [talentblickError, setTalentblickError] = useState(false)
  const [foxfolioError, setFoxfolioError] = useState(false)
  const [anschreibomatError, setAnschreibomatError] = useState(false)

  const ctaHref = session?.user ? `/${locale}/app/analyze` : `/${locale}/auth?mode=register`
  const ctaLabel = session?.user ? 'Zur App' : 'Kostenlos starten'

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="perf-orb absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_-5%,rgba(124,107,255,0.07),transparent)]" />
      </div>

      <MarketingNav />

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 pt-36 pb-20 sm:pt-44 sm:pb-28">

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[10px] font-semibold text-primary/60 tracking-[0.18em] uppercase mb-7"
        >
          KI-gestützte Bewerbungs-Assistenz
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.07 }}
          className="font-syne font-bold text-5xl sm:text-6xl md:text-7xl text-foreground leading-[1.06] tracking-tight max-w-3xl mb-6"
        >
          Der einfachste Weg zur{' '}
          <span className="gradient-text-primary">perfekten Bewerbung</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg text-muted max-w-md mx-auto leading-relaxed mb-10 font-light"
        >
          KI analysiert deinen Lebenslauf, findet Schwächen und schreibt dein
          Anschreiben — in Sekunden, nicht in Stunden.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-4"
        >
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-foreground text-white font-semibold text-sm hover:bg-foreground/90 transition-all duration-200 hover:-translate-y-px shadow-sm"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center px-7 py-3.5 rounded-2xl border border-border text-foreground/55 font-medium text-sm hover:border-border-strong hover:text-foreground transition-all duration-200"
          >
            Preise ansehen
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="text-xs text-muted/40 mb-14"
        >
          {session?.user
            ? 'Weiter analysieren und bewerben'
            : '6 Credits gratis · Kein Abo · Keine Kreditkarte'}
        </motion.p>

        <HeroPreview />
      </section>

      {/* ── Stats strip ─────────────────────────────── */}
      <section className="relative z-10 border-y border-border/50 bg-[#FAFBFF] py-7">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            {[
              { value: '< 30 Sek',  label: 'bis zur vollständigen Analyse' },
              { value: '3 Tools',   label: 'für deine Bewerbungsphase' },
              { value: '6 Credits', label: 'gratis für jeden neuen Account' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-syne font-bold text-foreground text-xl tracking-tight">{value}</p>
                <p className="text-xs text-muted mt-0.5 font-light">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ───────────────────────────────────── */}
      <section className="relative z-10 py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-[10px] font-semibold text-muted/50 uppercase tracking-[0.18em] mb-3">Die Tools</p>
            <h2 className="font-syne font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
              Alles was du für deine Bewerbung brauchst.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Talentblick */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="flex flex-col rounded-2xl border border-border bg-white p-7 hover:border-primary/20 hover:shadow-[0_4px_32px_rgba(124,107,255,0.07)] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/6 flex items-center justify-center mb-5">
                {!talentblickError ? (
                  <Image src="/Talentblick-logo500x500.png" alt="Talentblick" width={28} height={28}
                    className="object-contain" onError={() => setTalentblickError(true)} />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-[10px] font-semibold text-primary/60 tracking-[0.15em] uppercase mb-1.5">Lebenslauf-Analyse</p>
              <h3 className="font-syne font-bold text-foreground text-xl mb-3">Talentblick</h3>
              <p className="text-sm text-muted leading-relaxed font-light flex-1 mb-6">
                Detaillierte Bewertung deines Lebenslaufs mit Gesamtscore, Kategorien,
                ATS-Check und Job-Match-Analyse.
              </p>
              <ul className="space-y-2 mb-7">
                {['Gesamtpunkte & Detailkategorien', 'ATS-Kompatibilitäts-Check', 'Job-Match-Score'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted">
                    <div className="w-1 h-1 rounded-full bg-primary/35 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/app/analyze`}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all">
                Analyse starten <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Anschreibomat */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="flex flex-col rounded-2xl border border-border bg-white p-7 hover:border-accent-orange/20 hover:shadow-[0_4px_32px_rgba(255,140,66,0.07)] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-2xl bg-accent-orange/6 flex items-center justify-center mb-5">
                {!anschreibomatError ? (
                  <Image src="/Anschreibomat-logo500x500.png" alt="Anschreibomat" width={28} height={28}
                    className="object-contain" onError={() => setAnschreibomatError(true)} />
                ) : (
                  <Mail className="w-5 h-5 text-accent-orange" />
                )}
              </div>
              <p className="text-[10px] font-semibold text-accent-orange/60 tracking-[0.15em] uppercase mb-1.5">Anschreiben-Generator</p>
              <h3 className="font-syne font-bold text-foreground text-xl mb-3">Anschreibomat</h3>
              <p className="text-sm text-muted leading-relaxed font-light flex-1 mb-6">
                Generiert ein auf dich und die Stelle zugeschnittenes Anschreiben direkt
                aus deiner Analyse — in wenigen Sekunden.
              </p>
              <ul className="space-y-2 mb-7">
                {['Personalisiert & professionell', 'Passend zur Stellenanzeige', 'Sofort bearbeitbar'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted">
                    <div className="w-1 h-1 rounded-full bg-accent-orange/35 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/app/analyze`}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-orange transition-all">
                Anschreiben erstellen <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Foxfolio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="flex flex-col rounded-2xl border border-border bg-white p-7 hover:border-accent-sky/20 hover:shadow-[0_4px_32px_rgba(75,170,255,0.07)] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-2xl bg-accent-sky/6 flex items-center justify-center">
                  {!foxfolioError ? (
                    <Image src="/Foxfolio-logo500x500.png" alt="Foxfolio" width={28} height={28}
                      className="object-contain" onError={() => setFoxfolioError(true)} />
                  ) : (
                    <Layout className="w-5 h-5 text-accent-sky" />
                  )}
                </div>
                <span className="text-[10px] font-semibold text-muted px-2 py-1 rounded-full bg-surface-2 border border-border tracking-wide">
                  Bald
                </span>
              </div>
              <p className="text-[10px] font-semibold text-accent-sky/60 tracking-[0.15em] uppercase mb-1.5">Portfolio-Seite</p>
              <h3 className="font-syne font-bold text-foreground text-xl mb-3">Foxfolio</h3>
              <p className="text-sm text-muted leading-relaxed font-light flex-1 mb-6">
                Erstelle deine persönliche Portfolio-Seite und werde von Recruitern
                überall online gefunden.
              </p>
              <ul className="space-y-2 mb-7">
                {['Eigene Portfolio-URL', 'Von Recruitern auffindbar', 'Einfach zu pflegen'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted">
                    <div className="w-1 h-1 rounded-full bg-accent-sky/35 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/app/tools/foxfolio`}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-sky transition-all">
                Mehr erfahren <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────── */}
      <section className="relative z-10 border-t border-border/40 bg-[#FAFBFF] py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-semibold text-muted/50 uppercase tracking-[0.18em] mb-3">So funktioniert's</p>
            <h2 className="font-syne font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
              In 3 Schritten zum Ergebnis
            </h2>
          </motion.div>

          <div className="space-y-3">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Lebenslauf hochladen',
                desc: 'PDF hochladen oder Text einfügen. Optional mit Stellenausschreibung für noch präzisere Ergebnisse.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'KI analysiert in Sekunden',
                desc: 'Stärken, Schwächen, ATS-Kompatibilität, Job-Match-Score — alles auf einen Blick.',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Verbessern und bewerben',
                desc: 'Konkrete Vorschläge umsetzen, Anschreiben generieren lassen und selbstbewusst bewerben.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.09 }}
                  className="flex items-start gap-5 bg-white rounded-2xl border border-border p-6"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/6 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted/30 font-medium mb-1">{item.step}</p>
                    <h3 className="font-syne font-bold text-foreground text-sm mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed font-light">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Trust ───────────────────────────────────── */}
      <section className="relative z-10 border-t border-border/40 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/30 rounded-2xl overflow-hidden border border-border/40">
            {[
              { icon: Zap,           title: 'Sofortige Ergebnisse', desc: 'Analyse in unter 30 Sekunden' },
              { icon: Shield,        title: 'Datenschutz',          desc: 'Lebenslauf wird nicht gespeichert' },
              { icon: Target,        title: 'Präzise KI',           desc: 'Auf Bewerbungen spezialisiert' },
              { icon: CheckCircle2,  title: 'Kein Abo',             desc: 'Zahle nur was du nutzt' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white p-6 sm:p-8"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/6 flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="font-syne font-semibold text-foreground text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-muted font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border/40 bg-foreground py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="perf-orb absolute top-0 left-1/3 w-96 h-96 rounded-full bg-primary/25 blur-[120px]" />
          <div className="perf-orb absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent-sky/12 blur-[100px]" />
        </div>
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-syne font-bold text-3xl sm:text-5xl text-white mb-5 tracking-tight leading-tight">
              Bereit für deine nächste Bewerbung?
            </h2>
            <p className="text-white/38 text-base mb-10 font-light">
              Starte kostenlos — 6 Credits sind beim Registrieren inklusive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-foreground font-semibold text-sm hover:bg-white/92 transition-all duration-200 hover:-translate-y-px"
              >
                {ctaLabel}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex items-center px-7 py-3.5 rounded-2xl border border-white/10 text-white/45 font-medium text-sm hover:text-white/70 hover:border-white/20 transition-all duration-200"
              >
                Preise ansehen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <AppFooter />
    </div>
  )
}
