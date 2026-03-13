'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import {
  User, Mail, Lock, Camera, Save, Zap, ShieldCheck,
  CreditCard, Check, AlertTriangle, Eye, EyeOff, Trash2,
  ChevronRight, History, X, FileText, Pencil, BookOpen,
} from 'lucide-react'
import { useSavedCVs } from '@/hooks/useSavedCVs'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'
import CreditsPurchaseModal from '@/components/shared/CreditsPurchaseModal'
import { useCredits } from '@/hooks/useCredits'
import { cn } from '@/lib/utils'

type TabId = 'profil' | 'sicherheit' | 'credits' | 'lebenslaeufe'

// ── Confirm delete modal ─────────────────────────────────────────────────────
function DeleteAccountModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [input, setInput] = useState('')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-md rounded-2xl border border-border bg-white shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-status-red-light flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-status-red" />
          </div>
          <div>
            <h3 className="font-syne font-bold text-foreground text-base mb-1">Konto löschen</h3>
            <p className="text-sm text-muted">Diese Aktion ist unwiderruflich. Alle deine Daten werden dauerhaft gelöscht.</p>
          </div>
        </div>
        <p className="text-sm text-foreground mb-2">Tippe <span className="font-mono font-bold">LÖSCHEN</span> zur Bestätigung:</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="LÖSCHEN"
          className="w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-status-red/30 focus:border-status-red/50 mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-surface-2 transition-colors">
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={input !== 'LÖSCHEN'}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all',
              input === 'LÖSCHEN' ? 'bg-status-red hover:bg-status-red/90' : 'bg-status-red/30 cursor-not-allowed'
            )}
          >
            Endgültig löschen
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Profil section ────────────────────────────────────────────────────────────
function ProfilSection() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [imagePreview, setImagePreview] = useState<string | null>(session?.user?.image ?? null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = (session?.user?.name ?? session?.user?.email ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Nur Bilddateien erlaubt'); return }
    if (file.size > 2 * 1024 * 1024) { setError('Bild darf maximal 2 MB groß sein'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), image: imagePreview ?? undefined }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        throw new Error(d.error ?? 'Fehler beim Speichern')
      }
      await update({ name: name.trim(), hasImage: !!(imagePreview) })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }, [name, imagePreview, update])

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border hover:border-primary/50 transition-colors group"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Profilbild" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="font-syne font-bold text-2xl text-primary">{initials}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          {imagePreview && (
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-red text-white flex items-center justify-center hover:bg-status-red/90 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div>
          <p className="font-syne font-semibold text-foreground text-sm mb-0.5">Profilbild</p>
          <p className="text-xs text-muted">Klicke auf das Bild um es zu ändern.<br />PNG, JPG bis 2 MB.</p>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5">
          <User className="w-3.5 h-3.5 inline mr-1.5" />Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Dein Name"
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5">
          <Mail className="w-3.5 h-3.5 inline mr-1.5" />E-Mail
        </label>
        <div className="relative">
          <input
            value={session?.user?.email ?? ''}
            readOnly
            className="w-full rounded-xl border border-border bg-surface-2/60 px-4 py-3 text-sm text-muted cursor-not-allowed pr-10"
          />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
        </div>
        <p className="text-xs text-muted mt-1">E-Mail-Adresse kann nicht geändert werden.</p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-sm"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save button */}
      <motion.button
        onClick={handleSave}
        disabled={saving}
        whileHover={!saving ? { scale: 1.02, y: -1 } : {}}
        whileTap={!saving ? { scale: 0.97 } : {}}
        className={cn(
          'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all',
          saved
            ? 'bg-status-green-light text-status-green border border-status-green/20'
            : saving
            ? 'bg-primary/60 text-white cursor-not-allowed'
            : 'bg-primary text-white hover:shadow-primary'
        )}
      >
        {saved ? (
          <><Check className="w-4 h-4" />Gespeichert</>
        ) : saving ? (
          <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Wird gespeichert...</>
        ) : (
          <><Save className="w-4 h-4" />Änderungen speichern</>
        )}
      </motion.button>
    </div>
  )
}

// ── Sicherheit section ────────────────────────────────────────────────────────
function SicherheitSection() {
  const { data: session } = useSession()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user has Google account connected
  const hasGoogle = !!(session?.user as { image?: string } | undefined)?.image?.includes('googleusercontent')

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) { setError('Passwörter stimmen nicht überein'); return }
    if (newPw.length < 8) { setError('Neues Passwort muss mindestens 8 Zeichen haben'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Fehler')
      setSuccess(true)
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password section */}
      <div className="rounded-2xl border border-border bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-primary" />
          <h3 className="font-syne font-semibold text-foreground text-sm">Passwort ändern</h3>
        </div>

        {/* Current password */}
        <div className="relative">
          <label className="block text-xs font-medium text-muted mb-1.5">Aktuelles Passwort</label>
          <input
            type={showCurrent ? 'text' : 'password'}
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-[2.1rem] text-muted hover:text-foreground transition-colors">
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* New password */}
        <div className="relative">
          <label className="block text-xs font-medium text-muted mb-1.5">Neues Passwort</label>
          <input
            type={showNew ? 'text' : 'password'}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="Min. 8 Zeichen"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-[2.1rem] text-muted hover:text-foreground transition-colors">
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">Passwort bestätigen</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-status-green-light border border-status-green/20 text-status-green text-sm">
              <Check className="w-4 h-4 flex-shrink-0" />Passwort erfolgreich geändert
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleChangePassword}
          disabled={loading || !currentPw || !newPw || !confirmPw}
          whileHover={(!loading && currentPw && newPw && confirmPw) ? { scale: 1.02 } : {}}
          whileTap={(!loading && currentPw && newPw && confirmPw) ? { scale: 0.97 } : {}}
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all',
            loading || !currentPw || !newPw || !confirmPw
              ? 'bg-primary/40 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:shadow-primary'
          )}
        >
          {loading ? (
            <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Wird gespeichert...</>
          ) : (
            <><ShieldCheck className="w-4 h-4" />Passwort ändern</>
          )}
        </motion.button>
      </div>

      {/* Connected accounts */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="font-syne font-semibold text-foreground text-sm">Verknüpfte Konten</h3>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Google</p>
              <p className="text-xs text-muted">{hasGoogle ? 'Verknüpft' : 'Nicht verknüpft'}</p>
            </div>
          </div>
          <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', hasGoogle ? 'bg-status-green-light text-status-green border-status-green/20' : 'bg-surface-2 text-muted border-border')}>
            {hasGoogle ? 'Aktiv' : 'Nicht aktiv'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Credits section ───────────────────────────────────────────────────────────
function CreditsSection() {
  const { balance, mounted, addCredits } = useCredits()
  const [purchaseOpen, setPurchaseOpen] = useState(false)

  return (
    <>
      <div className="space-y-4">
        {/* Balance card */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-syne font-semibold text-foreground text-sm">Dein Guthaben</h3>
            </div>
            <motion.button
              onClick={() => setPurchaseOpen(true)}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:shadow-primary transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Credits kaufen
            </motion.button>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-mono font-black text-4xl text-primary">{mounted ? balance : '–'}</span>
            <span className="text-sm text-muted mb-1">Credits verfügbar</span>
          </div>
        </div>

        {/* What costs what */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="font-syne font-semibold text-foreground text-sm mb-3">Credits-Übersicht</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Lebenslauf analysieren', cost: 3, color: 'text-primary', bg: 'bg-primary/8 border-primary/15' },
              { label: 'Anschreiben generieren', cost: 2, color: 'text-accent-teal', bg: 'bg-accent-teal/8 border-accent-teal/15' },
            ].map((item) => (
              <div key={item.label} className={cn('flex items-center justify-between px-3.5 py-2.5 rounded-xl border', item.bg)}>
                <span className="text-sm text-foreground/80">{item.label}</span>
                <div className={cn('flex items-center gap-1 font-semibold text-sm', item.color)}>
                  <Zap className="w-3.5 h-3.5" />{item.cost} Credits
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free credits info */}
        <div className="rounded-2xl border border-status-green/20 bg-status-green-light p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-status-green/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-status-green" />
            </div>
            <div>
              <p className="font-syne font-semibold text-foreground text-sm mb-1">Gratis-Credits beim Start</p>
              <p className="text-xs text-muted leading-relaxed">
                Jeder neue Account erhält <span className="font-semibold text-foreground">6 Gratis-Credits</span> beim Registrieren — genug für 2 vollständige Lebenslauf-Analysen.
              </p>
            </div>
          </div>
        </div>

        {/* Purchase history stub */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-muted" />
            <h3 className="font-syne font-semibold text-foreground text-sm">Kaufhistorie</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-muted/50" />
            </div>
            <p className="text-sm text-muted font-medium">Bald verfügbar</p>
            <p className="text-xs text-muted/70 mt-0.5">Deine Käufe werden hier angezeigt.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {purchaseOpen && (
          <CreditsPurchaseModal
            currentBalance={balance}
            onClose={() => setPurchaseOpen(false)}
            onSuccess={(newBalance) => {
              addCredits(newBalance - balance)
              setPurchaseOpen(false)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Danger zone ───────────────────────────────────────────────────────────────
function DangerZone() {
  const locale = useLocale()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch('/api/user/delete', { method: 'DELETE' })
      await signOut({ callbackUrl: `/${locale}/auth` })
    } catch {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-status-red/20 bg-status-red-light/30 p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-status-red/10 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-4 h-4 text-status-red" />
          </div>
          <div className="flex-1">
            <h3 className="font-syne font-semibold text-foreground text-sm mb-1">Konto löschen</h3>
            <p className="text-xs text-muted leading-relaxed mb-3">
              Alle Daten werden dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-status-red/30 bg-white text-status-red text-xs font-semibold hover:bg-status-red hover:text-white transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Konto löschen
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <DeleteAccountModal
            onClose={() => !deleting && setShowConfirm(false)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Lebensläufe section ───────────────────────────────────────────────────────
function LebenslaeufeSection() {
  const { cvs, loading, rename, remove } = useSavedCVs()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleRename = async (id: string) => {
    if (!editName.trim()) return
    setSaving(true)
    await rename(id, editName.trim())
    setSaving(false)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await remove(id)
    setDeletingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-syne font-semibold text-foreground text-sm">Gespeicherte Lebensläufe</h3>
        </div>
        <p className="text-xs text-muted mb-5">
          Lebensläufe werden automatisch nach einer Analyse gespeichert und beim nächsten Start vorausgewählt. Maximal 10 Lebensläufe.
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full" />
          </div>
        ) : cvs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center mb-3 border border-border">
              <FileText className="w-5 h-5 text-muted/50" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Noch keine Lebensläufe gespeichert</p>
            <p className="text-xs text-muted">Starte eine Analyse und dein Lebenslauf wird automatisch hier gespeichert.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cvs.map((cv) => (
              <div key={cv.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-border/80 bg-surface-2/40 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>

                {editingId === cv.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRename(cv.id); if (e.key === 'Escape') setEditingId(null) }}
                      className="flex-1 rounded-lg border border-primary/40 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      onClick={() => handleRename(cv.id)}
                      disabled={saving}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:shadow-primary transition-all"
                    >
                      {saving ? '...' : 'OK'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground transition-colors">
                      Abbruch
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cv.name}</p>
                      <p className="text-xs text-muted">
                        {cv.lastUsedAt
                          ? `Zuletzt verwendet: ${new Date(cv.lastUsedAt).toLocaleDateString('de-DE')}`
                          : `Erstellt: ${new Date(cv.createdAt).toLocaleDateString('de-DE')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(cv.id); setEditName(cv.name) }}
                        className="w-7 h-7 rounded-lg hover:bg-surface-3 flex items-center justify-center text-muted hover:text-foreground transition-all"
                        title="Umbenennen"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cv.id)}
                        disabled={deletingId === cv.id}
                        className="w-7 h-7 rounded-lg hover:bg-status-red-light flex items-center justify-center text-muted hover:text-status-red transition-all"
                        title="Löschen"
                      >
                        {deletingId === cv.id
                          ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-status-red/30 border-t-status-red rounded-full" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Settings page ────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session } = useSession()
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<TabId>('profil')

  const initials = (session?.user?.name ?? session?.user?.email ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'sicherheit', label: 'Sicherheit', icon: ShieldCheck },
    { id: 'credits', label: 'Credits', icon: Zap },
    { id: 'lebenslaeufe', label: 'Lebensläufe', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="font-syne font-bold text-xl text-primary">{initials}</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="font-syne font-bold text-2xl sm:text-3xl text-foreground">Einstellungen</h1>
              <p className="text-sm text-muted mt-0.5">
                {session?.user?.name ?? session?.user?.email ?? 'Mein Konto'}
              </p>
            </div>
          </motion.div>

          {/* Tab bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex gap-1 rounded-2xl border border-border bg-white shadow-sm p-1.5 mb-6 overflow-x-auto scrollbar-hide"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex-shrink-0 transition-all duration-200',
                    isActive ? 'text-primary' : 'text-muted hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="settings-tab-indicator"
                      className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="space-y-5"
            >
              {activeTab === 'profil' && (
                <div className="rounded-2xl border border-border bg-white shadow-sm p-5 sm:p-6">
                  <ProfilSection />
                </div>
              )}

              {activeTab === 'sicherheit' && (
                <SicherheitSection />
              )}

              {activeTab === 'credits' && (
                <CreditsSection />
              )}

              {activeTab === 'lebenslaeufe' && (
                <LebenslaeufeSection />
              )}

              {/* Danger zone always visible at bottom when on security tab */}
              {activeTab === 'sicherheit' && (
                <DangerZone />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <a
              href={`/${locale}/app/analyze`}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Zurück zur App
            </a>
          </motion.div>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
