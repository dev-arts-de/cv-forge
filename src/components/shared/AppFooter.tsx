'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

export default function AppFooter() {
  const locale = useLocale()
  const [logoError, setLogoError] = useState(false)

  return (
    <footer className="border-t border-border bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            {!logoError ? (
              <div className="w-6 h-6 relative flex-shrink-0">
                <Image
                  src="/logo1000x1000.png"
                  alt="Bewerber-Schmiede"
                  width={24}
                  height={24}
                  className="object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-syne font-black text-xs">C</span>
              </div>
            )}
            <span className="font-syne font-bold text-sm text-foreground/70 group-hover:text-primary transition-colors">
              Bewerber-Schmiede
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-5 flex-wrap justify-center">
            <Link href={`/${locale}/imprint`} className="text-xs text-muted hover:text-foreground transition-colors">
              Impressum
            </Link>
            <Link href={`/${locale}/privacy`} className="text-xs text-muted hover:text-foreground transition-colors">
              Datenschutz
            </Link>
            <Link href={`/${locale}/terms`} className="text-xs text-muted hover:text-foreground transition-colors">
              AGB
            </Link>
            <a href="mailto:Kontakt@Shopitech.de" className="text-xs text-muted hover:text-foreground transition-colors">
              Kontakt
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} Bewerber-Schmiede
          </p>
        </div>
      </div>
    </footer>
  )
}
