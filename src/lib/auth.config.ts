import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config (no Prisma, no bcrypt)
export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user, trigger, session: sessionData }) {
      if (user) {
        token.id = user.id
        token.credits = (user as { credits?: number }).credits ?? 6
      }
      // Strip any base64 image data that may have ended up in the token previously
      if (typeof token.picture === 'string' && token.picture.startsWith('data:')) {
        token.hasImage = true
        delete token.picture
      }
      if (trigger === 'update') {
        const data = sessionData as { credits?: number; hasImage?: boolean }
        if (data?.credits !== undefined) token.credits = data.credits
        if (data?.hasImage !== undefined) token.hasImage = data.hasImage
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as { credits?: number }).credits = token.credits as number
        if (token.hasImage) {
          session.user.image = `/api/user/avatar?uid=${token.id}`
        }
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const locale = nextUrl.pathname.split('/')[1] || 'de'
      const isAuthPage = nextUrl.pathname.includes('/auth')
      const isLandingPage =
        nextUrl.pathname === `/${locale}` ||
        nextUrl.pathname === `/${locale}/`

      if (isAuthPage || isLandingPage) return true
      if (!isLoggedIn) return Response.redirect(new URL(`/${locale}/auth`, nextUrl))
      return true
    },
  },
  providers: [], // filled in auth.ts
}
