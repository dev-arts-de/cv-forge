import { NextRequest, NextResponse } from 'next/server'
import { scrapeJobUrl } from '@/lib/scraper'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url?: string }
    if (!url?.trim()) {
      return NextResponse.json({ error: 'missing_url' }, { status: 400 })
    }
    const text = await scrapeJobUrl(url.trim())
    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ error: 'scrape_failed' }, { status: 422 })
  }
}
