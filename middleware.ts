import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)
const LOCALES = routing.locales as readonly string[]

function getLocale(pathname: string): string {
  const segment = pathname.split('/')[1]
  return LOCALES.includes(segment) ? segment : routing.defaultLocale
}

function isPublicPath(pathname: string, locale: string): boolean {
  const norm = pathname.replace(/\/$/, '')
  const publicPrefixes = [
    `/${locale}`,
    `/${locale}/pricing`,
    `/${locale}/auth`,
    `/${locale}/imprint`,
    `/${locale}/privacy`,
    `/${locale}/terms`,
  ]
  return (
    norm === '' ||
    norm === '/' ||
    publicPrefixes.some((prefix) => norm === prefix || norm.startsWith(prefix + '/') && prefix !== `/${locale}`) ||
    norm === `/${locale}` // exact landing
  )
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const locale = getLocale(pathname)

  // Let intl handle locale redirects first
  const intlResponse = intlMiddleware(req)
  if (intlResponse && intlResponse.status !== 200) {
    return intlResponse
  }

  if (isPublicPath(pathname, locale)) {
    return intlResponse ?? NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const loginUrl = new URL(`/${locale}/auth`, req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged-in user visiting auth page → to app
  if (pathname.includes('/auth')) {
    return NextResponse.redirect(new URL(`/${locale}/app/analyze`, req.url))
  }

  return intlResponse ?? NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
