import { NextRequest, NextResponse } from 'next/server'
import { analyzeCVWithAI, NotACVError } from '@/lib/anthropic'
import { parsePDFBuffer } from '@/lib/pdf-parser'
import { checkRateLimit } from '@/lib/rate-limiter'
import type { Locale } from '@/types'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { allowed } = checkRateLimit(ip)

    if (!allowed) {
      return NextResponse.json(
        { error: 'rate_limit', message: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const locale = (req.headers.get('x-locale') ?? 'en') as Locale

    let cvText: string

    const contentType = req.headers.get('content-type') ?? ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const text = formData.get('text') as string | null

      if (text && text.trim().length > 0) {
        cvText = text.trim()
      } else if (file) {
        if (file.size > MAX_SIZE) {
          return NextResponse.json({ error: 'file_too_large' }, { status: 400 })
        }

        if (file.type === 'application/pdf') {
          const buffer = Buffer.from(await file.arrayBuffer())
          cvText = await parsePDFBuffer(buffer)
        } else if (file.type === 'text/plain') {
          cvText = await file.text()
        } else {
          return NextResponse.json({ error: 'invalid_type' }, { status: 400 })
        }
      } else {
        return NextResponse.json({ error: 'no_content' }, { status: 400 })
      }
    } else {
      const body = await req.json()
      cvText = body.text ?? ''
    }

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: 'too_short', message: 'CV text is too short' }, { status: 400 })
    }

    const result = await analyzeCVWithAI(cvText.trim(), locale)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof NotACVError) {
      return NextResponse.json({ error: 'not_a_cv' }, { status: 422 })
    }
    console.error('CV analysis error:', error)
    return NextResponse.json(
      { error: 'analysis_failed', message: 'Analysis failed' },
      { status: 500 }
    )
  }
}
