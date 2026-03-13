'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface CVViewerProps {
  text: string
}

type SectionType = 'contact' | 'experience' | 'education' | 'skills' | 'other'

interface CVLine {
  text: string
  section: SectionType
  isHeader: boolean
}

const SECTION_LABELS: Record<SectionType, { label: string; dot: string }> = {
  contact:    { label: 'Kontakt',    dot: 'bg-accent-sky' },
  experience: { label: 'Erfahrung', dot: 'bg-accent-peach' },
  education:  { label: 'Ausbildung', dot: 'bg-accent-teal' },
  skills:     { label: 'Skills',     dot: 'bg-accent-yellow' },
  other:      { label: 'Allgemein',  dot: 'bg-primary' },
}

const SECTION_KEYWORDS: Record<SectionType, string[]> = {
  experience: [
    'berufserfahrung','erfahrung','beschäftigung','tätigkeiten','arbeit',
    'career','experience','work','employment','professional','projects','projekte',
  ],
  education: [
    'ausbildung','bildung','studium','schule','hochschule','universität',
    'education','qualification','degree','certificate','training','weiterbildung',
  ],
  skills: [
    'kenntnisse','fähigkeiten','kompetenzen','skills','technologien',
    'tools','software','hard skills','soft skills','qualifikationen','sprachen',
  ],
  contact: [
    'kontakt','contact','persönliche','personal','profil','profile','anschrift','über mich',
    'address','telephone','telefon','email','linkedin','xing','github',
  ],
  other: [],
}

function detectSection(line: string, current: SectionType): SectionType {
  const lower = line.toLowerCase().trim()
  if (!lower) return current
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS) as [SectionType, string[]][]) {
    if (section === 'other') continue
    for (const kw of keywords) {
      if (lower.includes(kw)) return section
    }
  }
  return current
}

function isHeaderLine(line: string): boolean {
  const t = line.trim()
  if (!t || t.split(' ').length > 6) return false
  const isShort = t.length < 50
  const noTrailingPeriod = !t.endsWith('.')
  const noLeadingNumber = !/^\d/.test(t)
  return isShort && noTrailingPeriod && noLeadingNumber
}

function parseSections(text: string) {
  const lines = text.split('\n')
  let currentSection: SectionType = 'other'
  const groups: { section: SectionType; lines: { text: string; isHeader: boolean }[] }[] = []

  lines.forEach((raw, i) => {
    const line = raw.trimEnd()
    if (i < 5) {
      if (groups[0]?.section === 'contact') {
        groups[0].lines.push({ text: line, isHeader: i === 0 })
      } else {
        groups.unshift({ section: 'contact', lines: [{ text: line, isHeader: i === 0 }] })
      }
      return
    }

    const detected = detectSection(line, currentSection)
    if (detected !== currentSection) {
      currentSection = detected
      groups.push({ section: currentSection, lines: [] })
    }

    const last = groups[groups.length - 1]
    if (!last || last.section !== currentSection) {
      groups.push({ section: currentSection, lines: [{ text: line, isHeader: isHeaderLine(line) }] })
    } else {
      last.lines.push({ text: line, isHeader: isHeaderLine(line) && last.lines.length === 0 })
    }
  })

  return groups.filter((g) => g.lines.some((l) => l.text.trim()))
}

const SECTION_BG: Record<SectionType, string> = {
  contact:    'cv-section-contact',
  experience: 'cv-section-experience',
  education:  'cv-section-education',
  skills:     'cv-section-skills',
  other:      'cv-section-other',
}

export default function CVViewer({ text }: CVViewerProps) {
  const sections = useMemo(() => parseSections(text), [text])

  return (
    <div className="p-4 space-y-2">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2.5 pb-2 border-b border-border mb-3">
        {(Object.keys(SECTION_LABELS) as SectionType[]).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${SECTION_LABELS[s].dot}`} />
            <span className="text-[10px] text-muted">{SECTION_LABELS[s].label}</span>
          </div>
        ))}
      </div>

      {sections.map((group, gi) => (
        <motion.div
          key={gi}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: gi * 0.04, duration: 0.3 }}
          className={`rounded-lg px-3 py-2 ${SECTION_BG[group.section]}`}
        >
          {group.lines.map((line, li) => (
            <div
              key={li}
              className={
                line.isHeader
                  ? 'font-semibold text-foreground/90 text-[11px] mb-0.5 font-syne'
                  : 'text-foreground/65 text-[11px] font-mono leading-relaxed'
              }
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}
