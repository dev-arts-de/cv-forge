import { NextRequest, NextResponse } from 'next/server'
import {
  analyzeCVWithAI,
  analyzeJobMatchWithAI,
  analyzeCoverLetterWithAI,
  analyzeFitScoreWithAI,
  NotACVError,
} from '@/lib/anthropic'
import { parsePDFBuffer } from '@/lib/pdf-parser'
import { scrapeJobUrl } from '@/lib/scraper'
import { checkRateLimit } from '@/lib/rate-limiter'
import { auth } from '@/lib/auth'
import type { Locale, FullAnalysisResult } from '@/types'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

async function parseFileOrText(
  file: File | null,
  text: string | null
): Promise<string | null> {
  if (text && text.trim().length > 0) return text.trim()
  if (!file) return null

  if (file.size > MAX_SIZE) throw new Error('file_too_large')

  if (file.type === 'application/pdf') {
    const buffer = Buffer.from(await file.arrayBuffer())
    return await parsePDFBuffer(buffer)
  } else if (file.type === 'text/plain') {
    return await file.text()
  } else {
    throw new Error('invalid_type')
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — skip for authenticated users (they pay with credits)
    const session = await auth()
    if (!session?.user?.id) {
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0] ??
        req.headers.get('x-real-ip') ??
        'unknown'
      const { allowed } = checkRateLimit(ip)
      if (!allowed) {
        return NextResponse.json(
          { error: 'rate_limit', message: 'Rate limit exceeded' },
          { status: 429 }
        )
      }
    }

    const locale = (req.headers.get('x-locale') ?? 'en') as Locale

    const formData = await req.formData()

    // Parse CV
    const cvFile = formData.get('cv') as File | null
    const cvTextRaw = formData.get('cv_text') as string | null

    let cvText: string
    try {
      const parsed = await parseFileOrText(cvFile, cvTextRaw)
      if (!parsed || parsed.trim().length < 50) {
        return NextResponse.json({ error: 'no_content' }, { status: 400 })
      }
      cvText = parsed
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'unknown'
      if (msg === 'file_too_large') return NextResponse.json({ error: 'file_too_large' }, { status: 400 })
      if (msg === 'invalid_type') return NextResponse.json({ error: 'invalid_type' }, { status: 400 })
      throw err
    }

    // Parse job posting
    const jobUrl = formData.get('job_url') as string | null
    const jobTextRaw = formData.get('job_text') as string | null

    let jobText: string | null = null
    let jobScrapeFailed = false
    if (jobTextRaw && jobTextRaw.trim().length > 0) {
      jobText = jobTextRaw.trim()
    } else if (jobUrl && jobUrl.trim().length > 0) {
      try {
        jobText = await scrapeJobUrl(jobUrl.trim())
      } catch {
        // If scraping fails, continue without job text but flag it
        console.warn('Job URL scraping failed:', jobUrl)
        jobScrapeFailed = true
      }
    }

    // Parse cover letter
    const coverLetterFile = formData.get('cover_letter') as File | null
    const coverLetterTextRaw = formData.get('cover_letter_text') as string | null

    let coverLetterText: string | null = null
    try {
      coverLetterText = await parseFileOrText(coverLetterFile, coverLetterTextRaw)
    } catch {
      // Non-fatal, continue without cover letter
    }

    // Run analyses in parallel
    const cvAnalysisPromise = analyzeCVWithAI(cvText, locale)

    const jobMatchPromise =
      jobText ? analyzeJobMatchWithAI(cvText, jobText, locale) : Promise.resolve(undefined)

    const coverLetterPromise =
      coverLetterText && jobText
        ? analyzeCoverLetterWithAI(coverLetterText, jobText, locale)
        : Promise.resolve(undefined)

    const fitScorePromise =
      jobText && coverLetterText
        ? analyzeFitScoreWithAI(cvText, jobText, coverLetterText, locale)
        : jobText
        ? analyzeFitScoreWithAI(cvText, jobText, null, locale)
        : Promise.resolve(undefined)

    const [cv_analysis, job_match, cover_letter, fit_score] = await Promise.all([
      cvAnalysisPromise,
      jobMatchPromise,
      coverLetterPromise,
      fitScorePromise,
    ])

    const result: FullAnalysisResult = {
      cv_analysis,
      ...(job_match ? { job_match } : {}),
      ...(cover_letter ? { cover_letter } : {}),
      ...(fit_score ? { fit_score } : {}),
      _meta: {
        cvText,
        jobText: jobText ?? null,
        coverLetterText: coverLetterText ?? null,
        jobScrapeFailed,
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof NotACVError) {
      return NextResponse.json({ error: 'not_a_cv' }, { status: 422 })
    }
    console.error('Full analysis error:', error)
    return NextResponse.json(
      { error: 'analysis_failed', message: 'Analysis failed' },
      { status: 500 }
    )
  }
}
