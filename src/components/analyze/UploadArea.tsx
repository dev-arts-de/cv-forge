'use client'

import { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadAreaProps {
  onAnalyze: (data: FormData | { text: string }) => Promise<void>
  isAnalyzing: boolean
}

export default function UploadArea({ onAnalyze, isAnalyzing }: UploadAreaProps) {
  const t = useTranslations('analyze')
  const tErrors = useTranslations('errors')
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_SIZE = 5 * 1024 * 1024

  const validateFile = (f: File): string | null => {
    if (f.size > MAX_SIZE) return tErrors('file_too_large')
    if (!['application/pdf', 'text/plain'].includes(f.type)) return tErrors('invalid_type')
    return null
  }

  const handleFile = (f: File) => {
    const err = validateFile(f)
    if (err) { setError(err); return }
    setFile(f)
    setText('')
    setError(null)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [])

  const handleSubmit = async () => {
    if (!file && !text.trim()) return
    setError(null)
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      await onAnalyze(formData)
    } else {
      await onAnalyze({ text: text.trim() })
    }
  }

  const hasContent = file !== null || text.trim().length > 50

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={cn(
          'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden',
          isDragging
            ? 'border-primary bg-primary/5'
            : file
            ? 'border-primary/40 bg-primary/[0.03] cursor-default'
            : 'border-border hover:border-primary/50 hover:bg-surface-2'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        <div className="p-8">
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20"
                >
                  <FileText className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold truncate">{file.name}</p>
                  <p className="text-sm text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); setFile(null) }}
                  className="w-8 h-8 rounded-lg bg-border/60 hover:bg-status-red-light flex items-center justify-center text-muted hover:text-status-red transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  animate={isDragging ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={cn(
                    'w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300',
                    isDragging ? 'bg-primary/15 border border-primary/30' : 'bg-surface-3 border border-border'
                  )}
                >
                  <Upload className={cn('w-7 h-7 transition-colors duration-300', isDragging ? 'text-primary' : 'text-muted')} />
                </motion.div>
                <p className="font-semibold text-foreground/80 mb-1">{t('drag_drop')}</p>
                <p className="text-sm text-muted">{t('upload_hint')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-2xl pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* OR Divider */}
      {!file && (
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted font-medium px-1">{t('or')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}

      {/* Text Paste */}
      {!file && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('paste_placeholder')}
          rows={8}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none transition-all duration-200 shadow-sm hover:border-primary/30"
        />
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-sm"
          >
            <X className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!hasContent || isAnalyzing}
        whileHover={hasContent && !isAnalyzing ? { scale: 1.02, y: -1 } : {}}
        whileTap={hasContent && !isAnalyzing ? { scale: 0.97 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'relative w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 overflow-hidden',
          hasContent && !isAnalyzing
            ? 'bg-primary text-white shadow-primary hover:shadow-primary-lg cursor-pointer'
            : 'bg-surface-3 text-muted cursor-not-allowed'
        )}
      >
        {hasContent && !isAnalyzing && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
        {isAnalyzing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            {t('btn_analyzing')}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {t('btn_analyze')}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>
    </div>
  )
}
