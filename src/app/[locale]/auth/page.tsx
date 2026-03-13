'use client'

import { useState, useEffect, Suspense } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function AuthForm() {
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  )
  const [logoError, setLogoError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => { setError(null); setSuccess(null) }, [mode])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) { setError('E-Mail oder Passwort falsch.') }
    else { router.push(`/${locale}/app/analyze`); router.refresh() }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Registrierung fehlgeschlagen.'); setLoading(false); return }
      const login = await signIn('credentials', { email, password, redirect: false })
      setLoading(false)
      if (login?.error) { setSuccess('Konto erstellt! Bitte melde dich an.'); setMode('login') }
      else { router.push(`/${locale}/app/analyze`); router.refresh() }
    } catch {
      setError('Netzwerkfehler. Bitte versuche es erneut.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="perf-orb absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[100px]" />
        <div className="perf-orb absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent-sky/6 blur-[100px]" />
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm mb-6">
          <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />Zurück
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2.5 justify-center mb-4">
              {!logoError ? (
                <Image src="/logo1000x1000.png" alt="Bewerber-Schmiede" width={36} height={36} className="object-contain" onError={() => setLogoError(true)} />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-syne font-black text-sm">B</span>
                </div>
              )}
              <span className="font-syne font-bold text-lg text-foreground">Bewerber-Schmiede</span>
            </Link>
            <h1 className="font-syne font-bold text-2xl text-foreground mb-1">
              {mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
            </h1>
            <p className="text-sm text-muted">
              {mode === 'login' ? 'Melde dich an um fortzufahren' : 'Starte kostenlos mit 6 Credits'}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-status-red-light border border-status-red/20 text-status-red text-sm mb-4">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-status-green-light border border-status-green/20 text-status-green text-sm mb-4">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 mb-6">
            <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
              onClick={() => signIn('google', { callbackUrl: `/${locale}/app/analyze` })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border border-border bg-white hover:bg-surface-2 transition-all text-sm font-semibold text-foreground shadow-sm">
              <GoogleIcon />Mit Google {mode === 'login' ? 'anmelden' : 'registrieren'}
            </motion.button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted font-medium">oder mit E-Mail</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3 mb-5">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)"
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-3 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" required
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-3 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Passwort (min. 8 Zeichen)' : 'Passwort'} required
                className="w-full rounded-xl border border-border bg-white pl-10 pr-10 py-3 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <motion.button type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -1 } : {}} whileTap={!loading ? { scale: 0.97 } : {}}
              className={cn('w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                loading ? 'bg-primary/60 text-white cursor-not-allowed' : 'bg-primary text-white shadow-primary hover:shadow-primary-lg')}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted">
            {mode === 'login' ? (
              <>Noch kein Konto?{' '}<button onClick={() => setMode('register')} className="text-primary font-semibold hover:underline">Jetzt registrieren</button></>
            ) : (
              <>Bereits registriert?{' '}<button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">Anmelden</button></>
            )}
          </p>
          {mode === 'register' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-xl border border-accent-teal/20 bg-accent-teal-light/40 px-4 py-3 text-center">
              <p className="text-xs text-accent-teal font-semibold">Starte mit 6 kostenlosen Credits</p>
              <p className="text-xs text-muted mt-0.5">1 Analyse kostet 3 Credits · Weitere Credits kaufbar</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return <Suspense><AuthForm /></Suspense>
}
