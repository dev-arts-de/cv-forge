'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FileText, Shield, MessageSquare, Target, Zap, Globe } from 'lucide-react'

const icons = [FileText, Shield, MessageSquare, Target, Zap, Globe]

const ICON_COLORS = [
  'text-cyan-electric',
  'text-lime-neon',
  'text-cyan-electric',
  'text-lime-neon',
  'text-cyan-electric',
  'text-lime-neon',
]

const BG_COLORS = [
  'bg-cyan-electric/10',
  'bg-lime-neon/10',
  'bg-cyan-electric/10',
  'bg-lime-neon/10',
  'bg-cyan-electric/10',
  'bg-lime-neon/10',
]

const BENTO_CLASSES = [
  'col-span-1 md:col-span-2',
  'col-span-1',
  'col-span-1',
  'col-span-1',
  'col-span-1 md:col-span-2',
  'col-span-1',
]

interface FeatureItem {
  title: string
  desc: string
}

export default function Features() {
  const t = useTranslations('features')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const items = t.raw('items') as FeatureItem[]

  return (
    <section ref={ref} className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`${BENTO_CLASSES[i]} group relative rounded-xl border border-white/8 bg-surface-2 p-6 hover:bg-surface-3 hover:border-white/12 transition-all duration-300 hover:shadow-card-hover cursor-default overflow-hidden`}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl ${BG_COLORS[i]} opacity-50`} />
                </div>

                <div className="relative z-10">
                  <div className={`w-10 h-10 rounded-lg ${BG_COLORS[i]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${ICON_COLORS[i]}`} />
                  </div>
                  <h3 className="font-syne font-semibold text-lg text-foreground mb-2 group-hover:text-white transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
