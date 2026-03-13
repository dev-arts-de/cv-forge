'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="border-t border-white/5 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-cyan-electric/20 border border-cyan-electric/40 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-cyan-electric" />
              </div>
              <span className="font-syne font-bold text-foreground">
                CV<span className="text-cyan-electric">Forge</span>
              </span>
            </Link>
            <p className="text-sm text-foreground/40">{t('tagline')}</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/privacy`}
              className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors duration-200"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors duration-200"
            >
              {t('terms')}
            </Link>
            <Link
              href={`/${locale}/imprint`}
              className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors duration-200"
            >
              {t('imprint')}
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-foreground/30">
            © {new Date().getFullYear()} CVForge
          </p>
        </div>
      </div>
    </footer>
  )
}
