import axios from 'axios'
import * as cheerio from 'cheerio'

export async function scrapeJobUrl(url: string): Promise<string> {
  const timeout = parseInt(process.env.SCRAPER_TIMEOUT ?? '10000')

  const response = await axios.get(url, {
    timeout,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
    },
  })

  const $ = cheerio.load(response.data)

  // Remove noise
  $(
    'script, style, nav, header, footer, aside, [class*="cookie"], [class*="banner"], [class*="popup"], [id*="cookie"], [id*="banner"]'
  ).remove()

  // Try to find the job description container
  const selectors = [
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    '[class*="job-detail"]',
    '[class*="jobDetail"]',
    '[class*="stellenbeschreibung"]',
    '[class*="anzeige"]',
    'article',
    'main',
    '[role="main"]',
    '.content',
    '#content',
  ]

  let text = ''
  for (const selector of selectors) {
    const el = $(selector).first()
    if (el.length && el.text().trim().length > 200) {
      text = el.text()
      break
    }
  }

  if (!text || text.trim().length < 100) {
    text = $('body').text()
  }

  // Clean up whitespace
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 8000)
}
