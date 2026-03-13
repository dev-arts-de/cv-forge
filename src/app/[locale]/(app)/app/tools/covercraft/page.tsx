'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import AppFooter from '@/components/shared/AppFooter'
import { ArrowRight, FileText } from 'lucide-react'

export default function AnschreibomatPage() {
  const locale = useLocale()
  const [logoError, setLogoError] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="perf-orb absolute top-0 left-1/3 w-96 h-96 rounded-full bg-accent-teal/6 blur-[100px]" />
        <div className="perf-orb absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <Navbar />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pb-16 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 mx-auto mb-6">
            {!logoError ? (
              <Image
                src="/Anschreibomat-logo500x500.png"
                alt="Anschreibomat"
                width={64}
                height={64}
                className="object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <FileText className="w-8 h-8 text-accent-teal" />
            )}
          </div>

          <h1 className="font-syne font-bold text-3xl sm:text-4xl text-foreground mb-3">
            Anschreibomat
          </h1>
          <p className="text-base text-muted leading-relaxed mb-8 max-w-sm mx-auto">
            Der Anschreibomat ist direkt in Talentblick integriert — öffne einfach die Analyse und wechsle zum Anschreibomat-Tab.
          </p>

          <Link
            href={`/${locale}/app/analyze`}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-foreground text-white font-semibold text-sm hover:bg-foreground/90 transition-all duration-200 hover:-translate-y-px shadow-sm"
          >
            Zu Talentblick
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <AppFooter />
    </div>
  )
}
