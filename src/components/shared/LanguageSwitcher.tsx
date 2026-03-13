'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { LOCALES } from '@/types'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function LanguageSwitcher() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const currentLocale = LOCALES.find((l) => l.code === locale)

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-2 hover:bg-surface-3 hover:border-border-strong transition-all duration-200 text-sm text-muted hover:text-foreground"
      >
        <Globe className="w-3.5 h-3.5 text-primary" />
        <span className="hidden sm:inline">{currentLocale?.flag}</span>
        <span className="hidden md:inline text-xs font-medium">{currentLocale?.name}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40 touch-none" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute right-0 top-full mt-2 z-50 w-44 rounded-2xl border border-border bg-white shadow-lg overflow-hidden"
            >
              <div className="py-1.5">
                {LOCALES.map((loc, i) => (
                  <motion.button
                    key={loc.code}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleLocaleChange(loc.code)}
                    whileHover={{ backgroundColor: '#F0F2FF' }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-100',
                      loc.code === locale
                        ? 'text-primary bg-primary-light font-medium'
                        : 'text-foreground/70 hover:text-foreground'
                    )}
                  >
                    <span className="text-base">{loc.flag}</span>
                    <span>{loc.name}</span>
                    {loc.code === locale && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
