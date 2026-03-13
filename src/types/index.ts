export type Locale = 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'pl' | 'nl' | 'tr' | 'ar'

export type StatusColor = 'green' | 'yellow' | 'red'

export type CheckStatus = 'pass' | 'warn' | 'fail'

export interface CheckItem {
  id: string
  label: string
  status: CheckStatus
  note: string
}

export interface AnalysisCategory {
  score: number
  status: StatusColor
  feedback: string
  checks: CheckItem[]
}

export interface CVAnalysisResult {
  overall_score: number
  grade: string
  top_quick_wins: string[]
  categories: {
    grundstruktur: AnalysisCategory
    sprache: AnalysisCategory
    berufserfahrung: AnalysisCategory
    ausbildung: AnalysisCategory
    skills: AnalysisCategory
    kontakt: AnalysisCategory
    ats: AnalysisCategory
    gesamtwirkung: AnalysisCategory
  }
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'done' | 'error'
  result: CVAnalysisResult | null
  error: string | null
}

export interface LocaleInfo {
  code: Locale
  name: string
  flag: string
  rtl?: boolean
}

export const LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
]

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  pt: 'Portuguese',
  pl: 'Polish',
  nl: 'Dutch',
  tr: 'Turkish',
  ar: 'Arabic',
}

export const CATEGORY_KEYS = [
  'grundstruktur',
  'sprache',
  'berufserfahrung',
  'ausbildung',
  'skills',
  'kontakt',
  'ats',
  'gesamtwirkung',
] as const

export type CategoryKey = typeof CATEGORY_KEYS[number]

// ─── New types for full analysis ────────────────────────────────────────────

export type CoverLetterCategoryKey =
  | 'grundstruktur'
  | 'stellenbezug'
  | 'motivation'
  | 'qualifikationen'
  | 'kompetenzen'
  | 'unternehmensbezug'
  | 'sprache'
  | 'zukunft'
  | 'schluss'

export const COVER_LETTER_CATEGORY_KEYS: CoverLetterCategoryKey[] = [
  'grundstruktur',
  'stellenbezug',
  'motivation',
  'qualifikationen',
  'kompetenzen',
  'unternehmensbezug',
  'sprache',
  'zukunft',
  'schluss',
]

export interface ImprovementSuggestion {
  section: string
  original: string
  improved: string
  reason: string
}

export interface CoverLetterResult {
  overall_score: number
  grade: string
  humanness_score: number
  success_probability: string
  categories: Record<CoverLetterCategoryKey, AnalysisCategory>
  top_improvements: ImprovementSuggestion[]
}

export interface SkillMatch {
  skill: string
  has: boolean
  importance: 'must' | 'nice'
  note?: string
}

export interface FitScoreResult {
  overall_fit: number
  grade: string
  skills_match: SkillMatch[]
  experience_fit: number
  motivation_fit: number
  culture_fit: number
  recommendation: string
  recommendation_level: 'strong' | 'good' | 'weak'
  summary: string
  missing_critical: string[]
}

export interface JobMatchResult {
  overall_match_score: number
  grade: string
  required_skills: string[]
  matching_skills: string[]
  missing_skills: string[]
  nice_to_have_skills: string[]
  company_culture: string
  ats_keywords: string[]
  feedback: string
  top_improvements: string[]
}

export interface FullAnalysisResult {
  cv_analysis: CVAnalysisResult
  job_match?: JobMatchResult
  cover_letter?: CoverLetterResult
  fit_score?: FitScoreResult
  _meta?: {
    cvText: string
    jobText: string | null
    coverLetterText: string | null
    jobScrapeFailed?: boolean
  }
}

export interface AnalysisInput {
  cvText: string
  cvFileName?: string
  cvFileUrl?: string
  jobText?: string
  jobUrl?: string
  coverLetterText?: string
}
