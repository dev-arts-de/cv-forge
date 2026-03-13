'use client'

import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface StepItem {
  step: string
  title: string
  desc: string
}

export default function HowItWorks() {
  const t = useTranslations('how_it_works')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const steps = t.raw('steps') as StepItem[]

  return (
    <section id="how-it-works" ref={ref} className="py-24 sm:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/50 to-surface/0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-cyan-electric/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step number */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl border border-cyan-electric/30 bg-cyan-electric/10 flex items-center justify-center group-hover:border-cyan-electric/60 group-hover:bg-cyan-electric/20 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <span className="font-syne font-bold text-xl text-cyan-electric font-mono">
                      {step.step}
                    </span>
                  </div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-2xl border border-cyan-electric/10 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="font-syne font-semibold text-xl text-foreground mb-3 group-hover:text-white transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
