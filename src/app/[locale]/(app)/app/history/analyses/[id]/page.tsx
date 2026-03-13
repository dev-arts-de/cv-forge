'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'
import FullResultsView from '@/components/analyze/FullResultsView'
import type { FullAnalysisResult } from '@/types'

interface AnalysisDetail {
  id: string
  cvFileName: string | null
  jobTitle: string | null
  overallScore: number | null
  result: FullAnalysisResult
  cvText: string | null
  jobText: string | null
  coverLetterText: string | null
  createdAt: string
}

export default function AnalysisDetailPage() {
  const { id, locale } = useParams<{ id: string; locale: string }>()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/analyses/${id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null }
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(data => { if (data) setAnalysis(data) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleBack = () => router.push(`/${locale}/app/history`)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/6 blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-accent-sky/5 blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12">
        {/* Back button */}
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
            <h3 className="font-syne font-bold text-base text-foreground mb-1">Analyse nicht gefunden</h3>
            <p className="text-sm text-muted mb-6">Diese Analyse existiert nicht oder wurde gelöscht.</p>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Zum Verlauf
            </button>
          </motion.div>
        )}

        {!loading && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FullResultsView
              result={analysis.result}
              cvText={analysis.cvText ?? undefined}
              jobText={analysis.jobText ?? undefined}
              coverLetterText={analysis.coverLetterText ?? undefined}
              cvFileName={analysis.cvFileName ?? undefined}
              onReset={handleBack}
            />
          </motion.div>
        )}
      </div>

      <AppFooter />
    </div>
  )
}
