'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, AlertCircle, Copy, Check, Download, Calendar, Briefcase } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'

interface CoverLetterDetail {
  id: string
  jobTitle: string | null
  text: string
  createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function LetterDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const router = useRouter()
  const [letter, setLetter] = useState<CoverLetterDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/cover-letters/${id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null }
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(data => { if (data) setLetter(data) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleBack = () => router.push(`/${locale}/app/history`)

  const handleCopy = async () => {
    if (!letter) return
    await navigator.clipboard.writeText(letter.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!letter) return
    const blob = new Blob([letter.text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Anschreiben${letter.jobTitle ? `_${letter.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}` : ''}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/6 blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-accent-teal/5 blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12">
        {/* Back */}
        <motion.button
          onClick={handleBack}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Verlauf
        </motion.button>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
          </div>
        )}

        {!loading && notFound && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center py-20 px-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-muted" />
            </div>
            <h3 className="font-syne font-bold text-base text-foreground mb-1">Anschreiben nicht gefunden</h3>
            <p className="text-sm text-muted mb-6">Dieses Anschreiben existiert nicht oder wurde gelöscht.</p>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Zum Verlauf
            </button>
          </motion.div>
        )}

        {!loading && letter && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Header card */}
            <div className="rounded-2xl border border-border bg-white shadow-sm px-4 sm:px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-accent-teal" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-syne font-bold text-base text-foreground truncate">
                    {letter.jobTitle ?? 'Anschreiben'}
                  </h1>
                  <span className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
                    <Calendar className="w-2.5 h-2.5" />
                    {formatDate(letter.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-white hover:bg-surface-2 text-xs font-semibold text-muted hover:text-foreground transition-all duration-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-status-green" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Kopiert' : 'Kopieren'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-foreground text-white text-xs font-semibold hover:bg-foreground/90 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exportieren</span>
                </button>
              </div>
            </div>

            {/* Letter text */}
            <div className="rounded-2xl border border-border bg-white shadow-sm p-5 sm:p-7">
              <pre className="font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {letter.text}
              </pre>
            </div>
          </motion.div>
        )}
      </div>

      <AppFooter />
    </div>
  )
}
