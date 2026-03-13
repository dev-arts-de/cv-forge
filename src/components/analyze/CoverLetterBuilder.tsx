'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Wand2, Copy, Check, ChevronLeft, ChevronRight,
  RefreshCw, FileText, Mail, Building2, User,
  Star, BookOpen, Target, MessageSquare, Handshake,
  Sparkles, ArrowRight, Zap, LogIn, AlertTriangle, AlignLeft,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import type { GeneratedLetter, LetterBlock, BlockType } from '@/app/api/generate-cover-letter/route'
import { cn } from '@/lib/utils'
import { useCredits } from '@/hooks/useCredits'
import CreditsPurchaseModal from '@/components/shared/CreditsPurchaseModal'

interface CoverLetterBuilderProps {
  cvText: string
  jobText?: string
  existingLetter?: string
}

const BLOCK_META: Record<BlockType, { label: string; icon: React.ElementType; color: string; bg: string; blockClass: string }> = {
  betreff:                    { label: 'Betreff',                   icon: Mail,         color: 'text-accent-peach',  bg: 'bg-accent-peach-light',  blockClass: 'block-betreff' },
  anrede:                     { label: 'Anrede',                    icon: User,         color: 'text-accent-orange', bg: 'bg-accent-orange-light', blockClass: 'block-anrede' },
  einleitung:                 { label: 'Einleitung',                icon: Star,         color: 'text-primary',       bg: 'bg-primary-light',       blockClass: 'block-einleitung' },
  hauptteil_qualifikationen:  { label: 'Qualifikationen',           icon: BookOpen,     color: 'text-accent-sky',    bg: 'bg-accent-sky-light',    blockClass: 'block-hauptteil' },
  hauptteil_motivation:       { label: 'Motivation',                icon: Target,       color: 'text-accent-teal',   bg: 'bg-accent-teal-light',   blockClass: 'block-hauptteil' },
  hauptteil_unternehmen:      { label: 'Unternehmensbezug',         icon: Building2,    color: 'text-accent-yellow', bg: 'bg-accent-yellow-light', blockClass: 'block-hauptteil' },
  schluss:                    { label: 'Schluss',                   icon: MessageSquare, color: 'text-accent-teal',  bg: 'bg-accent-teal-light',   blockClass: 'block-schluss' },
  grussformel:                { label: 'Grußformel',                icon: Handshake,    color: 'text-accent-yellow', bg: 'bg-accent-yellow-light', blockClass: 'block-grussformel' },
}

function BlockCard({
  block,
  selectedIndex,
  onSelectVariant,
  delay,
}: {
  block: LetterBlock
  selectedIndex: number
  onSelectVariant: (blockId: BlockType, idx: number) => void
  delay: number
}) {
  const meta = BLOCK_META[block.id] ?? {
    label: block.label,
    icon: FileText,
    color: 'text-primary',
    bg: 'bg-primary-light',
    blockClass: 'block-einleitung',
  }
  const Icon = meta.icon
  const total = block.variants.length
  const [dir, setDir] = useState(0)

  const navigate = (delta: number) => {
    const next = Math.max(0, Math.min(total - 1, selectedIndex + delta))
    if (next !== selectedIndex) {
      setDir(delta)
      onSelectVariant(block.id, next)
    }
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 280, damping: 24, delay }}
      className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden"
    >
      {/* Block header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${meta.bg}`}>
            <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
          </div>
          <span className="font-syne font-semibold text-sm text-foreground">{meta.label}</span>
        </div>

        {/* Variant navigator */}
        {total > 1 && (
          <div className="flex items-center gap-1.5">
            <motion.button
              onClick={() => navigate(-1)}
              disabled={selectedIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-6 h-6 rounded-lg flex items-center justify-center border border-border hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3 h-3 text-muted" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-1">
              {block.variants.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setDir(i > selectedIndex ? 1 : -1); onSelectVariant(block.id, i) }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'rounded-full transition-all duration-200',
                    i === selectedIndex ? `w-4 h-2 ${meta.bg.replace('bg-', 'bg-')}` : 'w-2 h-2 bg-border'
                  )}
                  style={i === selectedIndex ? { backgroundColor: meta.color.replace('text-', '') } : {}}
                />
              ))}
            </div>

            <motion.button
              onClick={() => navigate(1)}
              disabled={selectedIndex === total - 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-6 h-6 rounded-lg flex items-center justify-center border border-border hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3 h-3 text-muted" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content with slide animation */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={selectedIndex}
            custom={dir}
            initial={{ x: dir >= 0 ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir >= 0 ? -40 : 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="px-4 py-4"
          >
            <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
              {block.variants[selectedIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Variant label */}
      {total > 1 && (
        <div className="px-4 pb-3 flex items-center gap-1">
          <span className="text-[10px] font-medium text-muted">
            Variante {selectedIndex + 1} von {total}
          </span>
        </div>
      )}
    </motion.div>
  )
}

function FullPreview({
  letter,
  selections,
  senderName,
}: {
  letter: GeneratedLetter
  selections: Record<BlockType, number>
  senderName: string
}) {
  const [copied, setCopied] = useState(false)

  const assembled = letter.blocks
    .map((b) => b.variants[selections[b.id] ?? 0] ?? b.variants[0])
    .join('\n\n')

  const fullText = senderName
    ? `${senderName}\n\n${assembled}`
    : assembled

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.2 }}
      className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-surface-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-syne font-semibold text-sm text-foreground">Vorschau — Vollständiges Anschreiben</span>
        </div>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200',
            copied
              ? 'bg-status-green-light text-status-green border border-status-green/20'
              : 'bg-primary text-white shadow-sm hover:shadow-primary'
          )}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
                <Check className="w-3 h-3" />
                Kopiert!
              </motion.div>
            ) : (
              <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1.5">
                <Copy className="w-3 h-3" />
                Kopieren
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="p-6 max-h-[480px] overflow-y-auto">
        {letter.company && (
          <div className="mb-6 pb-4 border-b border-border">
            <p className="text-xs text-muted">An</p>
            <p className="text-sm font-medium text-foreground">{letter.company}</p>
            {letter.recipientName && (
              <p className="text-sm text-foreground/70">{letter.recipientName}</p>
            )}
          </div>
        )}
        <div className="space-y-4">
          {letter.blocks.map((block) => {
            const text = block.variants[selections[block.id] ?? 0] ?? block.variants[0]
            const meta = BLOCK_META[block.id]
            return (
              <div key={block.id} className={`px-3 py-2.5 rounded-lg ${meta?.blockClass ?? ''}`}>
                <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">{text}</p>
              </div>
            )
          })}
        </div>
        {senderName && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground">{senderName}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function CoverLetterBuilder({ cvText, jobText: jobTextProp, existingLetter }: CoverLetterBuilderProps) {
  const locale = useLocale()
  const { data: session } = useSession()
  const { balance, canAfford, spend, refund, costs, mounted, addCredits } = useCredits()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [letter, setLetter] = useState<GeneratedLetter | null>(null)
  const [selections, setSelections] = useState<Record<BlockType, number>>({} as Record<BlockType, number>)
  const [senderName, setSenderName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [localJobText, setLocalJobText] = useState(jobTextProp ?? '')
  const [jobInputMode, setJobInputMode] = useState<'url' | 'text'>('url')

  const jobText = localJobText.trim()
  const hasJob = jobText.length > 10

  const handleGenerate = useCallback(async () => {
    if (!session?.user) return
    const ok = await spend('cover_letter')
    if (!ok) {
      setError('Nicht genug Credits. Bitte kaufe weitere Credits.')
      return
    }
    setStatus('loading')
    setError(null)
    try {
      const isUrl = jobText.startsWith('http')
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({
          cvText,
          ...(isUrl ? { jobUrl: jobText } : { jobText }),
          existingLetter,
        }),
      })
      if (!res.ok) {
        await refund('cover_letter')
        const errData = await res.json().catch(() => ({})) as { error?: string }
        if (errData.error === 'scrape_failed' || res.status === 422) {
          setError('Die Stellenanzeige konnte nicht abgerufen werden. Bitte füge den Text der Stellenausschreibung manuell ein.')
          setJobInputMode('text')
          setLocalJobText('')
        } else if (errData.error === 'missing_inputs') {
          setError('Bitte gib eine Stellenausschreibung an.')
        } else {
          setError('Generierung fehlgeschlagen. Deine Credits wurden erstattet.')
        }
        setStatus('error')
        return
      }
      const data = await res.json() as GeneratedLetter
      const init: Record<BlockType, number> = {} as Record<BlockType, number>
      data.blocks.forEach((b) => { init[b.id] = 0 })
      setSelections(init)
      setLetter(data)
      setStatus('done')

      // Auto-save cover letter
      if (session?.user) {
        const assembled = data.blocks.map((b) => b.variants[0]).join('\n\n')
        const jobTitle = jobText
          ? jobText.split('\n').find(l => l.trim().length > 5 && l.trim().length < 80)?.trim()
          : undefined
        fetch('/api/cover-letters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: assembled, jobTitle }),
        }).catch(() => {})
      }
    } catch {
      await refund('cover_letter')
      setError('Generierung fehlgeschlagen. Deine Credits wurden erstattet.')
      setStatus('error')
    }
  }, [cvText, jobText, existingLetter, locale, session, spend, refund])

  const handleSelectVariant = useCallback((blockId: BlockType, idx: number) => {
    setSelections((prev) => ({ ...prev, [blockId]: idx }))
  }, [])

  const isLoggedIn = !!session?.user
  const hasCredits = mounted && canAfford('cover_letter')
  const cost = costs.cover_letter
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)

  const purchaseModal = purchaseModalOpen ? (
    <CreditsPurchaseModal
      currentBalance={balance}
      onClose={() => setPurchaseModalOpen(false)}
      onSuccess={(newBalance) => {
        addCredits(newBalance - balance)
        setPurchaseModalOpen(false)
      }}
    />
  ) : null

  // ── IDLE / ERROR ──
  if (status === 'idle' || status === 'error') {
    return (
      <>
      {purchaseModal}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 px-6 text-center"
      >
        <div className="w-14 h-14 mb-5">
          <Image
            src="/Anschreibomat-logo500x500.png"
            alt="Anschreibomat"
            width={56}
            height={56}
            className="object-contain w-full h-full"
          />
        </div>

        <h3 className="font-syne font-bold text-lg text-foreground mb-2">
          Anschreiben generieren
        </h3>
        <p className="text-muted text-sm max-w-xs leading-relaxed mb-7">
          KI erstellt ein passgenaues Anschreiben auf Basis deines Lebenslaufs und der Stellenanzeige.
        </p>

        {/* Job input — shown when no job was provided in the original analysis */}
        {!jobTextProp && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs mb-5 text-left"
          >
            <div className="flex gap-1 p-0.5 bg-surface-2 rounded-xl border border-border mb-2.5">
              {(['url', 'text'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setJobInputMode(m)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold flex-1 justify-center transition-all duration-200',
                    jobInputMode === m
                      ? 'bg-white text-primary shadow-sm border border-border'
                      : 'text-muted hover:text-foreground'
                  )}
                >
                  {m === 'url' ? <><ArrowRight className="w-3 h-3" />URL</> : <><AlignLeft className="w-3 h-3" />Text</>}
                </button>
              ))}
            </div>
            {jobInputMode === 'url' ? (
              <div className="relative">
                <ArrowRight className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
                <input
                  type="url"
                  value={localJobText}
                  onChange={(e) => setLocalJobText(e.target.value)}
                  placeholder="https://unternehmen.de/jobs/..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-surface-2/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            ) : (
              <textarea
                value={localJobText}
                onChange={(e) => setLocalJobText(e.target.value)}
                placeholder="Stellenausschreibung hier einfügen..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-2/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all"
              />
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-sm mb-5 w-full max-w-xs"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
          </motion.div>
        )}

        {!isLoggedIn ? (
          <Link
            href={`/${locale}/auth`}
            className="relative w-full max-w-xs flex items-center justify-center gap-2.5 py-3.5 rounded-2xl btn-gradient-animated text-white font-semibold text-sm overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <LogIn className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Anmelden &amp; starten</span>
            <span className="relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/15 text-xs font-bold">
              <Zap className="w-3 h-3" />{cost}
            </span>
          </Link>
        ) : !hasCredits ? (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <div className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-sm">
              <Zap className="w-4 h-4 flex-shrink-0" />
              <span>{balance} von {cost} Credits vorhanden</span>
            </div>
            <button
              onClick={() => setPurchaseModalOpen(true)}
              className="text-xs text-primary font-semibold underline-offset-2 underline hover:no-underline"
            >
              Credits kaufen
            </button>
          </div>
        ) : (
          <motion.button
            onClick={handleGenerate}
            disabled={!hasJob}
            whileHover={hasJob ? { scale: 1.015, y: -1 } : {}}
            whileTap={hasJob ? { scale: 0.98 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={cn(
              'relative w-full max-w-xs flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-semibold text-sm overflow-hidden shadow-lg transition-all duration-300',
              hasJob ? 'btn-gradient-animated cursor-pointer' : 'bg-surface-3 text-muted cursor-not-allowed shadow-none'
            )}
          >
            {hasJob && <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />}
            <Sparkles className={cn('w-4 h-4 relative z-10', !hasJob && 'text-muted')} />
            <span className="relative z-10 tracking-wide">Anschreiben generieren</span>
            {hasJob && <span className="relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/15 text-xs font-bold">
              <Zap className="w-3 h-3" />{cost}
            </span>}
          </motion.button>
        )}
      </motion.div>
      </>
    )
  }

  // ── LOADING ──
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 min-h-[460px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="flex flex-col items-center gap-6"
        >
          <Image
            src="/logo-loading-500x500.gif"
            // Anschreibomat uses the base Bewerber-Schmiede animation
            alt="Generating"
            width={120}
            height={120}
            unoptimized
            className="rounded-3xl"
          />
          <div className="text-center space-y-1.5">
            <motion.h3
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-syne font-bold text-xl text-foreground"
            >
              Anschreiben wird erstellt
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-muted text-sm max-w-[260px] text-center"
            >
              KI analysiert deine Daten und erstellt individuelle Textbausteine...
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent-orange/60"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // ── DONE ──
  if (!letter) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-syne font-bold text-lg text-foreground">
            {letter.position ? `Anschreiben: ${letter.position}` : 'Dein individuelles Anschreiben'}
          </h3>
          {letter.company && (
            <p className="text-sm text-muted mt-0.5">
              für <span className="font-medium text-foreground/70">{letter.company}</span>
            </p>
          )}
        </div>
        <motion.button
          onClick={handleGenerate}
          disabled={!hasCredits}
          whileHover={hasCredits ? { scale: 1.04 } : {}}
          whileTap={hasCredits ? { scale: 0.96 } : {}}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted border border-border hover:bg-surface-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-3 h-3" />
          Neu generieren
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-accent-orange">
            <Zap className="w-2.5 h-2.5" />{cost}
          </span>
        </motion.button>
      </div>

      {/* Sender name input */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-white">
        <User className="w-4 h-4 text-muted flex-shrink-0" />
        <input
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Dein Name (wird am Ende eingefügt)"
          className="flex-1 text-sm text-foreground placeholder:text-muted/60 bg-transparent focus:outline-none"
        />
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Blocks */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide px-0.5">
            Textbausteine — wähle deine Variante
          </p>
          {letter.blocks.map((block, i) => (
            <BlockCard
              key={block.id}
              block={block}
              selectedIndex={selections[block.id] ?? 0}
              onSelectVariant={handleSelectVariant}
              delay={i * 0.04}
            />
          ))}
        </div>

        {/* Preview */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide px-0.5 mb-3">
            Vorschau — Vollständiges Anschreiben
          </p>
          <FullPreview letter={letter} selections={selections} senderName={senderName} />
        </div>
      </div>
    </div>
  )
}
