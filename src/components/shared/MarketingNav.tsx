'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function MarketingNav() {
  const locale = useLocale()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Talentblick', href: `/${locale}/app/analyze` },
    { label: 'Foxfolio', href: `/${locale}/app/tools/foxfolio` },
    { label: 'Anschreibomat', href: `/${locale}/app/tools/covercraft` },
    { label: 'Preise', href: `/${locale}/pricing` },
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group flex-shrink-0">
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

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-black/[0.04] transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              {session?.user ? (
                <Link
                  href={`/${locale}/app/analyze`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Zur App
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href={`/${locale}/auth`}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    Anmelden
                  </Link>
                  <Link
                    href={`/${locale}/auth?mode=register`}
                    className="px-4 py-2 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-colors"
                  >
                    Kostenlos starten
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-black/[0.05] transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="md:hidden overflow-hidden border-t border-border/50 bg-white"
            >
              <div className="max-w-6xl mx-auto px-4 py-4 space-y-0.5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border/50 my-2" />
                {session?.user ? (
                  <Link
                    href={`/${locale}/app/analyze`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
                  >
                    Zur App <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/${locale}/auth`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
                    >
                      Anmelden
                    </Link>
                    <Link
                      href={`/${locale}/auth?mode=register`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-foreground text-white text-sm font-semibold mt-1"
                    >
                      Kostenlos starten
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
