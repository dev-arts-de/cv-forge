'use client'

import { useLocale } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useCredits } from '@/hooks/useCredits'
import { Zap, Plus, User, Target, Layout, Mail, Menu, X, LogIn, UserPlus, LogOut, Settings, Clock } from 'lucide-react'
import CreditsPurchaseModal from '@/components/shared/CreditsPurchaseModal'

export default function Navbar() {
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [scrolled, setScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [showCreditsBump, setShowCreditsBump] = useState(false)
  const [creditToast, setCreditToast] = useState<number | null>(null)
  const [userOpen, setUserOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const { balance, setBalance, mounted, addCredits, pollUntilUpdated } = useCredits()
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [prevBalance, setPrevBalance] = useState(balance)
  const userRef = useRef<HTMLDivElement>(null)

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (balance !== prevBalance && prevBalance !== 0) {
      setShowCreditsBump(true)
      const t = setTimeout(() => setShowCreditsBump(false), 800)
      setPrevBalance(balance)
      return () => clearTimeout(t)
    }
    if (prevBalance === 0 && balance > 0) setPrevBalance(balance)
  }, [balance, mounted, prevBalance])

  // Detect ?payment=success after Stripe redirect
  useEffect(() => {
    if (!mounted || !isLoggedIn) return
    if (searchParams.get('payment') !== 'success') return

    const added = parseInt(searchParams.get('credits') ?? '0', 10)

    router.replace(window.location.pathname)

    // Refresh balance from DB and show toast
    fetch('/api/credits')
      .then((r) => r.ok ? r.json() : null)
      .then((data: { credits: number } | null) => {
        if (data && typeof data.credits === 'number') {
          setBalance(data.credits)
        }
        if (added > 0) {
          setCreditToast(added)
          setTimeout(() => setCreditToast(null), 3500)
        }
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, isLoggedIn])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const tools = [
    { label: 'Talentblick', href: `/${locale}/app/analyze`, icon: Target, accent: 'text-primary' },
    { label: 'Foxfolio', href: `/${locale}/app/tools/foxfolio`, icon: Layout, accent: 'text-accent-sky' },
    { label: 'Anschreibomat', href: `/${locale}/app/tools/covercraft`, icon: Mail, accent: 'text-accent-teal' },
    { label: 'Verlauf', href: `/${locale}/app/history`, icon: Clock, accent: 'text-muted' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'perf-nav bg-white/95 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_20px_rgba(0,0,0,0.04)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 group flex-shrink-0">
              {!logoError ? (
                <div className="w-7 h-7 relative flex-shrink-0">
                  <Image
                    src="/logo1000x1000.png"
                    alt="Bewerber-Schmiede"
                    width={28}
                    height={28}
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-syne font-black text-xs">B</span>
                </div>
              )}
              <span className="font-syne font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                Bewerber-Schmiede
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-black/[0.04] transition-all duration-150"
                >
                  {tool.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/pricing`}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-black/[0.04] transition-all duration-150"
              >
                Preise
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Credits — only when logged in */}
              {mounted && isLoggedIn && (
                <motion.div
                  animate={showCreditsBump ? { scale: [1, 1.2, 0.95, 1] } : {}}
                  transition={{ duration: 0.5, type: 'tween', ease: 'easeInOut' }}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors duration-200',
                    balance === 0
                      ? 'bg-status-red-light border-status-red/20 text-status-red'
                      : balance <= 2
                      ? 'bg-status-yellow-light border-status-yellow/20 text-status-yellow'
                      : 'bg-primary/6 border-primary/15 text-primary'
                  )}
                >
                  <Zap className="w-3 h-3 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={balance}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                    >
                      {balance}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-current/50 hidden sm:inline">Credits</span>
                  <button
                    onClick={() => setPurchaseModalOpen(true)}
                    className="ml-0.5 w-4 h-4 rounded-full bg-current/10 flex items-center justify-center hover:bg-current/20 transition-colors"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </motion.div>
              )}

              {/* User avatar / menu */}
              <div ref={userRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserOpen(!userOpen)}
                  className={cn(
                    'w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 overflow-hidden',
                    isLoggedIn
                      ? 'bg-primary/8 border-primary/20 hover:border-primary/50'
                      : 'bg-surface-2 border-border hover:bg-surface-3 hover:border-border-strong'
                  )}
                >
                  {isLoggedIn && session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : isLoggedIn ? (
                    <span className="text-primary font-syne font-bold text-xs">
                      {session.user?.name?.[0]?.toUpperCase() ?? session.user?.email?.[0]?.toUpperCase() ?? 'U'}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-muted" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute top-full right-0 mt-2 w-52 rounded-2xl border border-border bg-white shadow-lg shadow-black/[0.06] p-2 z-50"
                    >
                      {isLoggedIn ? (
                        <>
                          <div className="px-3 py-2 mb-1">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {session.user?.name ?? 'Mein Konto'}
                            </p>
                            <p className="text-xs text-muted truncate">{session.user?.email}</p>
                          </div>
                          <div className="h-px bg-border mb-1" />
                          <Link
                            href={`/${locale}/app/settings`}
                            onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors text-sm font-medium text-foreground"
                          >
                            <Settings className="w-3.5 h-3.5 text-muted" />
                            Einstellungen
                          </Link>
                          <button
                            onClick={() => { setUserOpen(false); signOut({ callbackUrl: `/${locale}/auth` }) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-status-red-light hover:text-status-red transition-colors text-sm font-medium text-foreground"
                          >
                            <LogOut className="w-4 h-4" />
                            Abmelden
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href={`/${locale}/auth`} onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors text-sm font-medium text-foreground">
                            <LogIn className="w-4 h-4 text-primary" />Anmelden
                          </Link>
                          <Link href={`/${locale}/auth?mode=register`} onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-primary/6 transition-colors text-sm font-semibold text-primary">
                            <UserPlus className="w-4 h-4" />Registrieren
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/[0.05] transition-colors"
              >
                {mobileOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4 text-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 top-14 z-40 bg-white border-t border-border/50 overflow-y-auto overscroll-contain touch-pan-y"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-2 transition-colors"
                    >
                      <Icon className={cn('w-4 h-4', tool.accent)} />
                      <span className="text-sm font-medium text-foreground">{tool.label}</span>
                    </Link>
                  )
                })}
                <Link
                  href={`/${locale}/pricing`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-2 transition-colors"
                >
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Preise</span>
                </Link>
                <div className="h-px bg-border/50 my-2" />
                {!isLoggedIn ? (
                  <>
                    <Link href={`/${locale}/auth`} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-2 transition-colors">
                      <LogIn className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Anmelden</span>
                    </Link>
                    <Link href={`/${locale}/auth?mode=register`} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/6 transition-colors">
                      <UserPlus className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">Registrieren</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/${locale}/app/settings`} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-2 transition-colors">
                      <Settings className="w-4 h-4 text-foreground" />
                      <span className="text-sm font-medium text-foreground">Einstellungen</span>
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: `/${locale}/auth` }) }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-status-red-light hover:text-status-red transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Abmelden</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {purchaseModalOpen && (
        <CreditsPurchaseModal
          currentBalance={balance}
          onClose={() => setPurchaseModalOpen(false)}
          onSuccess={(newBalance) => {
            addCredits(newBalance - balance)
            setPurchaseModalOpen(false)
          }}
        />
      )}

      {/* Credit purchase success toast */}
      <AnimatePresence>
        {creditToast !== null && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-foreground text-white text-sm font-semibold shadow-xl shadow-black/20 whitespace-nowrap">
              <Zap className="w-4 h-4 text-primary" />
              +{creditToast} Credits wurden gutgeschrieben
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
