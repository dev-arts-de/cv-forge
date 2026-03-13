'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Pricing() {
  const t = useTranslations('pricing')
  const locale = useLocale()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const freeFeatures = t.raw('free_features') as string[]
  const premiumFeatures = t.raw('premium_features') as string[]

  return (
    <section id="pricing" ref={ref} className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-electric/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-foreground/60 text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl border border-white/10 bg-surface-2 p-8"
          >
            <div className="mb-6">
              <h3 className="font-syne font-bold text-xl text-foreground mb-2">{t('free_title')}</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-syne font-bold text-4xl text-foreground">{t('free_price')}</span>
                <span className="text-foreground/50 text-sm">{t('per_month')}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/70">
                  <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-foreground/60" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button asChild variant="secondary" className="w-full">
              <Link href={`/${locale}/analyze`}>
                {t('cta_free')}
              </Link>
            </Button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl border border-cyan-electric/40 bg-surface-2 p-8 shadow-[0_0_40px_rgba(0,229,255,0.1)] overflow-hidden"
          >
            {/* Premium glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-electric via-cyan-dark to-cyan-electric" />
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-electric/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-syne font-bold text-xl text-foreground">{t('premium_title')}</h3>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-electric/20 border border-cyan-electric/30">
                  <Zap className="w-3 h-3 text-cyan-electric" />
                  <span className="text-xs text-cyan-electric font-semibold">Popular</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-syne font-bold text-4xl text-foreground">{t('premium_price')}</span>
                <span className="text-foreground/50 text-sm">{t('per_month')}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="w-5 h-5 rounded-full bg-cyan-electric/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-cyan-electric" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="w-full">
                {t('cta_premium')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
