'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'
import MultiInputPanel from '@/components/analyze/MultiInputPanel'
import FullResultsView from '@/components/analyze/FullResultsView'
import AnalyzingState from '@/components/analyze/AnalyzingState'
import type { FullAnalysisResult, AnalysisInput } from '@/types'
import { RotateCcw, AlertTriangle, Link2, AlignLeft, ArrowRight, Loader2, Clock } from 'lucide-react'
import { useCredits } from '@/hooks/useCredits'
import { useSavedCVs } from '@/hooks/useSavedCVs'
import { useSession } from 'next-auth/react'

type PageStatus = 'idle' | 'url_check' | 'url_failed' | 'analyzing' | 'done' | 'error' | 'not_cv'

function fireConfetti() {
  const count = 180
  const defaults = { origin: { y: 0.65 }, zIndex: 9999 }
  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) })
  }
  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#7C6BFF', '#4BAAFF'] })
  fire(0.2,  { spread: 60, colors: ['#00C9B8', '#FFD166'] })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#FF8C7A', '#7C6BFF'] })
  fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#4BAAFF', '#00C9B8'] })
  fire(0.1,  { spread: 120, startVelocity: 45, colors: ['#FFD166', '#FF8C7A'] })
}

function NotCVError({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col items-center text-center py-16 px-8 max-w-md mx-auto"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-6xl mb-4 select-none"
      >
        🤔
      </motion.div>
      <h2 className="font-syne font-bold text-xl text-foreground mb-2">
        Das scheint kein Lebenslauf zu sein
      </h2>
      <p className="text-muted text-sm leading-relaxed mb-6">
        Wir haben kein typisches Lebenslauf-Format erkannt. Bitte lade einen echten CV hoch oder füge deinen Lebenslauf-Text ein.
      </p>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-status-yellow-light border border-status-yellow/20 mb-6 text-left w-full">
        <AlertTriangle className="w-4 h-4 text-status-yellow flex-shrink-0" />
        <span className="text-xs text-status-yellow">
          Keine Credits abgezogen — dein Guthaben wurde erstattet. Unterstützt werden PDF-Dateien und Lebenslauf-Text.
        </span>
      </div>
      <motion.button
        onClick={onReset}
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-primary"
      >
        <RotateCcw className="w-4 h-4" />
        Erneut versuchen
      </motion.button>
    </motion.div>
  )
}

function UrlCheckState({ url }: { url: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="mb-5"
      >
        <Loader2 className="w-8 h-8 text-primary/60" />
      </motion.div>
      <h3 className="font-syne font-semibold text-base text-foreground mb-1.5">
        Stellenanzeige wird geprüft
      </h3>
      <p className="text-xs text-muted max-w-xs leading-relaxed truncate px-4">
        {url}
      </p>
    </motion.div>
  )
}

function ScrapeFailedPanel({
  failedUrl,
  onProceedWithText,
  onProceedWithoutJob,
  onReset,
}: {
  failedUrl: string
  onProceedWithText: (text: string) => void
  onProceedWithoutJob: () => void
  onReset: () => void
}) {
  const [pastedText, setPastedText] = useState('')
  const [mode, setMode] = useState<'choice' | 'paste'>('choice')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasText = pastedText.trim().length > 50

  const handleSwitchToPaste = () => {
    setMode('paste')
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex flex-col items-center py-10 px-6 sm:px-10 text-center max-w-lg mx-auto"
    >
      <div className="w-12 h-12 rounded-2xl bg-status-yellow-light border border-status-yellow/20 flex items-center justify-center mb-5">
        <Link2 className="w-5 h-5 text-status-yellow" />
      </div>

      <h2 className="font-syne font-bold text-xl text-foreground mb-2">
        Stellenanzeige nicht abrufbar
      </h2>
      <p className="text-muted text-sm leading-relaxed mb-1">
        Die URL konnte nicht automatisch gelesen werden.
      </p>
      <p className="text-[11px] text-muted/60 font-mono bg-surface-2 border border-border px-3 py-1.5 rounded-lg mb-7 max-w-full truncate">
        {failedUrl}
      </p>

      <AnimatePresence mode="wait">
        {mode === 'choice' ? (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="w-full space-y-3"
          >
            {/* Option A: paste text */}
            <motion.button
              onClick={handleSwitchToPaste}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/20 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <AlignLeft className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Text manuell einfügen</p>
                <p className="text-xs text-white/70 font-normal mt-0.5">
                  Vollständige Analyse mit allen Tabs
                </p>
              </div>
              <ArrowRight className="w-4 h-4 opacity-70 flex-shrink-0" />
            </motion.button>

            {/* Option B: skip job */}
            <motion.button
              onClick={onProceedWithoutJob}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-border bg-white hover:bg-surface-2 text-sm font-medium text-foreground/80 text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-surface-3 border border-border flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-muted" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Ohne Stellenanzeige fortfahren</p>
                <p className="text-xs text-muted font-normal mt-0.5">
                  Nur Lebenslauf-Analyse (keine Job-Match-Tabs)
                </p>
              </div>
            </motion.button>

            {/* Cancel */}
            <button
              onClick={onReset}
              className="text-xs text-muted hover:text-foreground transition-colors pt-1"
            >
              Abbrechen &amp; neu starten
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="w-full space-y-3"
          >
            <p className="text-xs text-muted text-left mb-1">
              Kopiere den Text der Stellenanzeige und füge ihn hier ein:
            </p>
            <textarea
              ref={textareaRef}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Stellenausschreibung hier einfügen..."
              rows={8}
              className="w-full rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all text-left"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setMode('choice')}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors font-medium"
              >
                Zurück
              </button>
              <motion.button
                onClick={() => onProceedWithText(pastedText.trim())}
                disabled={!hasText}
                whileHover={hasText ? { scale: 1.02 } : {}}
                whileTap={hasText ? { scale: 0.98 } : {}}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-white shadow-sm"
              >
                Analyse starten
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AnalyzePage() {
  const tErrors = useTranslations('errors')
  const locale = useLocale()

  const [status, setStatus] = useState<PageStatus>('idle')
  const [result, setResult] = useState<FullAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cvText, setCVText] = useState<string>('')
  const [cvFileUrl, setCvFileUrl] = useState<string>('')
  const [jobText, setJobText] = useState<string>('')
  const [coverLetterText, setCoverLetterText] = useState<string>('')
  const [cvFileName, setCvFileName] = useState<string>('')
  const [failedUrl, setFailedUrl] = useState<string>('')
  const [analysisHasJob, setAnalysisHasJob] = useState(false)

  // Store the pending input while URL is being checked
  const pendingInputRef = useRef<(AnalysisInput & { _formData?: FormData }) | null>(null)

  const { spend, refund } = useCredits()
  const { save: saveCv } = useSavedCVs()
  const { data: session } = useSession()

  /** Core function: spend credits and run the analysis */
  const runAnalysis = useCallback(async (
    input: AnalysisInput & { _formData?: FormData },
    resolvedJobText: string | null,
  ) => {
    const spent = await spend('analysis')
    if (!spent) {
      setError('Nicht genug Credits. Kaufe mehr Credits um fortzufahren.')
      setStatus('error')
      return
    }

    setStatus('analyzing')
    setAnalysisHasJob(!!resolvedJobText)
    setError(null)
    setResult(null)

    if (input.cvText) setCVText(input.cvText); else setCVText('')
    if (input.cvFileName) setCvFileName(input.cvFileName); else setCvFileName('')
    if (input.cvFileUrl) setCvFileUrl(input.cvFileUrl); else setCvFileUrl('')
    setJobText(resolvedJobText ?? '')
    if (input.coverLetterText) setCoverLetterText(input.coverLetterText); else setCoverLetterText('')

    try {
      // Build fresh FormData — always use resolved job text, never a URL at this point
      const formData = new FormData()

      if (input._formData) {
        // Selectively copy CV and cover letter fields — skip job fields (we'll add resolved text)
        const cvFile = input._formData.get('cv') as File | null
        const cvText = input._formData.get('cv_text') as string | null
        const clFile = input._formData.get('cover_letter') as File | null
        const clText = input._formData.get('cover_letter_text') as string | null
        if (cvFile) formData.append('cv', cvFile)
        else if (cvText) formData.append('cv_text', cvText)
        if (clFile) formData.append('cover_letter', clFile)
        else if (clText) formData.append('cover_letter_text', clText)
      } else {
        if (input.cvText) formData.append('cv_text', input.cvText)
        if (input.coverLetterText) formData.append('cover_letter_text', input.coverLetterText)
      }

      // Append resolved job text (already scraped or manually pasted)
      if (resolvedJobText) {
        formData.append('job_text', resolvedJobText)
      }

      const response = await fetch('/api/analyze-full', {
        method: 'POST',
        headers: { 'x-locale': locale },
        body: formData,
      })

      if (response.status === 429) {
        await refund('analysis')
        setError(tErrors('rate_limit'))
        setStatus('error')
        return
      }
      if (response.status === 422) {
        await refund('analysis')
        setStatus('not_cv')
        return
      }
      if (!response.ok) {
        await refund('analysis')
        throw new Error('Analysis failed')
      }

      const json = await response.json() as FullAnalysisResult
      setResult(json)
      if (json._meta) {
        if (json._meta.cvText) setCVText(json._meta.cvText)
        if (json._meta.jobText) setJobText(json._meta.jobText)
        if (json._meta.coverLetterText) setCoverLetterText(json._meta.coverLetterText ?? '')
      }
      setStatus('done')
      setTimeout(() => fireConfetti(), 300)

      if (session?.user?.id) {
        const textToSave = json._meta?.cvText ?? input.cvText
        const nameToSave = input.cvFileName
        if (textToSave) saveCv(textToSave, nameToSave).catch(() => {})

        fetch('/api/analyses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            result: json,
            cvFileName: input.cvFileName,
            cvText: json._meta?.cvText ?? input.cvText,
            jobText: resolvedJobText,
            coverLetterText: input.coverLetterText,
          }),
        }).then(async r => {
          if (!r.ok) console.error('[analyses] save failed:', r.status, await r.text())
        }).catch(e => console.error('[analyses] save error:', e))
      }
    } catch (err) {
      console.error(err)
      setError(tErrors('analysis_failed'))
      setStatus('error')
    }
  }, [locale, tErrors, spend, refund, saveCv, session?.user?.id])

  /** Entry point from MultiInputPanel */
  const handleAnalyze = useCallback(async (input: AnalysisInput & { _formData?: FormData }) => {
    if (input.jobUrl) {
      // Pre-check the URL BEFORE spending any credits
      pendingInputRef.current = input
      setStatus('url_check')
      setFailedUrl(input.jobUrl)
      try {
        const res = await fetch('/api/scrape-job', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: input.jobUrl }),
        })
        if (!res.ok) {
          setStatus('url_failed')
          return
        }
        const { text } = await res.json() as { text: string }
        // URL scraped successfully — proceed with the scraped text
        await runAnalysis(input, text)
      } catch {
        setStatus('url_failed')
      }
    } else {
      // No URL — run directly with whatever job text was provided (or none)
      await runAnalysis(input, input.jobText ?? null)
    }
  }, [runAnalysis])

  /** User pasted the job text manually after URL failure */
  const handleProceedWithText = useCallback(async (text: string) => {
    if (!pendingInputRef.current) return
    await runAnalysis(pendingInputRef.current, text)
  }, [runAnalysis])

  /** User chose to skip job and run CV-only */
  const handleProceedWithoutJob = useCallback(async () => {
    if (!pendingInputRef.current) return
    await runAnalysis(pendingInputRef.current, null)
  }, [runAnalysis])

  const handleReset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
    setCVText('')
    setCvFileUrl('')
    setJobText('')
    setCoverLetterText('')
    setCvFileName('')
    setFailedUrl('')
    pendingInputRef.current = null
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="perf-orb absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[80px]" />
        <div className="perf-orb absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent-sky/8 blur-[80px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-5 sm:pb-8">

          {/* Top action bar — always visible */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <Link
              href={`/${locale}/app/history`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-muted hover:text-foreground bg-surface-2 hover:bg-surface-3 border border-border transition-all duration-200"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Verlauf</span>
            </Link>

            <AnimatePresence>
              {status === 'done' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleReset}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-muted hover:text-foreground bg-surface-2 hover:bg-surface-3 border border-border transition-all duration-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Neue Analyse
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">

            {(status === 'idle' || status === 'error') && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <MultiInputPanel onAnalyze={handleAnalyze} isAnalyzing={false} />
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {(status === 'url_check' || status === 'url_failed') && (
              <motion.div
                key="url-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-border bg-white shadow-sm max-w-lg mx-auto"
              >
                <AnimatePresence mode="wait">
                  {status === 'url_check' ? (
                    <UrlCheckState key="check" url={failedUrl} />
                  ) : (
                    <ScrapeFailedPanel
                      key="failed"
                      failedUrl={failedUrl}
                      onProceedWithText={handleProceedWithText}
                      onProceedWithoutJob={handleProceedWithoutJob}
                      onReset={handleReset}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {status === 'not_cv' && (
              <motion.div
                key="not-cv"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-border bg-white shadow-sm max-w-lg mx-auto"
              >
                <NotCVError onReset={handleReset} />
              </motion.div>
            )}

            {status === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-border bg-white shadow-sm"
              >
                <AnalyzingState hasJob={analysisHasJob} />
              </motion.div>
            )}

            {status === 'done' && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <FullResultsView
                  result={result}
                  cvText={cvText}
                  cvFileUrl={cvFileUrl}
                  jobText={jobText}
                  coverLetterText={coverLetterText}
                  cvFileName={cvFileName}
                  onReset={handleReset}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <AppFooter />
    </div>
  )
}
