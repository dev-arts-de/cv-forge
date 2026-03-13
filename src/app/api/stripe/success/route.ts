import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(`${appUrl}/de/app/analyze`)
  }

  let addedCredits = '0'

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      const { userId, credits } = session.metadata ?? {}

      if (userId && credits) {
        const existing = await prisma.payment.findUnique({
          where: { stripeSessionId: sessionId },
        })

        if (!existing) {
          await prisma.$transaction([
            prisma.user.update({
              where: { id: userId },
              data: { credits: { increment: parseInt(credits, 10) } },
            }),
            prisma.payment.create({
              data: { stripeSessionId: sessionId, userId, credits: parseInt(credits, 10) },
            }),
          ])
        }

        addedCredits = credits
      }
    }
  } catch (err) {
    console.error('[stripe/success] error:', err)
  }

  return NextResponse.redirect(`${appUrl}/de/app/analyze?payment=success&credits=${addedCredits}`)
}
