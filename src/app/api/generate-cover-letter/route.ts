import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { checkRateLimit } from '@/lib/rate-limiter'
import { auth } from '@/lib/auth'
import { scrapeJobUrl } from '@/lib/scraper'
import type { Locale } from '@/types'
import { LANGUAGE_NAMES } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type BlockType = 'betreff' | 'anrede' | 'einleitung' | 'hauptteil_qualifikationen' | 'hauptteil_motivation' | 'hauptteil_unternehmen' | 'schluss' | 'grussformel'

export interface LetterBlock {
  id: BlockType
  label: string
  variants: string[]
}

export interface GeneratedLetter {
  blocks: LetterBlock[]
  recipientName?: string
  position?: string
  company?: string
}

const SCHEMA = `{
  "recipientName": <string | null: full name of contact person if found in job posting>,
  "position": <string: job title>,
  "company": <string: company name>,
  "blocks": [
    {
      "id": "betreff",
      "label": "Betreff",
      "variants": [
        <variant 1: concise subject line, e.g. "Bewerbung als [Position] – [optionale Referenz]">,
        <variant 2: slightly different emphasis>
      ]
    },
    {
      "id": "anrede",
      "label": "Anrede",
      "variants": [
        <variant 1: personal address if name known, e.g. "Sehr geehrte Frau [Name],">,
        <variant 2: fallback "Sehr geehrte Damen und Herren,">,
        <variant 3: modern alternative if appropriate>
      ]
    },
    {
      "id": "einleitung",
      "label": "Einleitung",
      "variants": [
        <variant 1: strong, hook-based opening — 2-3 sentences, no "Hiermit bewerbe ich mich">,
        <variant 2: slightly different tone — more personal>,
        <variant 3: achievement-led opening>
      ]
    },
    {
      "id": "hauptteil_qualifikationen",
      "label": "Qualifikationen & Erfahrung",
      "variants": [
        <variant 1: 3-4 sentences highlighting most relevant experience from CV for this specific job>,
        <variant 2: slightly different angle, different experiences highlighted>,
        <variant 3: more concise version>
      ]
    },
    {
      "id": "hauptteil_motivation",
      "label": "Motivation & Bezug",
      "variants": [
        <variant 1: 2-3 sentences explaining genuine motivation for this specific role and company>,
        <variant 2: more personal, emotionally resonant>,
        <variant 3: more strategic, career-focused>
      ]
    },
    {
      "id": "hauptteil_unternehmen",
      "label": "Unternehmensbezug",
      "variants": [
        <variant 1: 2-3 sentences showing specific knowledge of company/industry and enthusiasm>,
        <variant 2: different angle on company fit>,
        <variant 3: focused on contributing to specific goals>
      ]
    },
    {
      "id": "schluss",
      "label": "Schluss",
      "variants": [
        <variant 1: confident closing with call to action, mention availability for interview>,
        <variant 2: warmer, more personal closing>,
        <variant 3: concise, professional closing>
      ]
    },
    {
      "id": "grussformel",
      "label": "Grußformel",
      "variants": [
        "Mit freundlichen Grüßen,",
        "Freundliche Grüße,",
        "Mit besten Grüßen,"
      ]
    }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — skip for authenticated users (they pay with credits)
    const session = await auth()
    if (!session?.user?.id) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? 'unknown'
      const { allowed } = checkRateLimit(ip)
      if (!allowed) return NextResponse.json({ error: 'rate_limit' }, { status: 429 })
    }

    const locale = (req.headers.get('x-locale') ?? 'de') as Locale
    const languageName = LANGUAGE_NAMES[locale]

    const body = await req.json() as { cvText: string; jobText?: string; jobUrl?: string; existingLetter?: string }
    const { cvText, existingLetter } = body

    // Resolve job text — either direct or via URL scraping
    let jobText = body.jobText?.trim() ?? ''
    if (!jobText && body.jobUrl?.trim()) {
      try {
        jobText = await scrapeJobUrl(body.jobUrl.trim())
      } catch {
        return NextResponse.json({ error: 'scrape_failed' }, { status: 422 })
      }
    }

    if (!cvText?.trim() || !jobText) {
      return NextResponse.json({ error: 'missing_inputs' }, { status: 400 })
    }

    const existingSection = existingLetter?.trim()
      ? `\n\n--- EXISTING COVER LETTER (use as reference for tone/style) ---\n${existingLetter.trim()}`
      : ''

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    const system = `You are an expert career coach and copywriter specializing in ${languageName} job applications. You create highly personalized, human-sounding cover letters tailored to the specific job and company.
Today's date: ${today}. Use this as the authoritative reference for all date and timeline evaluations.

Generate a complete cover letter in ${languageName} in structured blocks. Each block has 2-3 variants so the applicant can choose the best fit.

Rules:
- NEVER use "Hiermit bewerbe ich mich" as opening
- Each variant must sound different — not just slightly rephrased
- Be specific: reference actual skills/experiences from the CV and actual requirements from the job posting
- Sound human and authentic, not templated
- All text in ${languageName}
- Each block variant: 1-4 sentences max (except qualifications which can be 4-5)
- No placeholder text like "[Name]" — use actual data from inputs

Respond ONLY as valid JSON matching this exact schema. No markdown. No text outside JSON.

${SCHEMA}`

    const user = `Generate a cover letter for this application. Respond in ${languageName}.

--- CV ---
${cvText.slice(0, 4000)}

--- JOB POSTING ---
${jobText.slice(0, 3000)}${existingSection}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response')

    let jsonText = content.text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const result = JSON.parse(jsonText) as GeneratedLetter

    if (!Array.isArray(result.blocks) || result.blocks.length === 0) {
      throw new Error('Invalid response structure')
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Cover letter generation error:', error)
    return NextResponse.json({ error: 'generation_failed' }, { status: 500 })
  }
}
