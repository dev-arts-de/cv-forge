import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStripe, CREDIT_PACKAGES, type PackageId } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const { packageId } = (await req.json()) as { packageId: PackageId }
  const pkg = CREDIT_PACKAGES[packageId]
  if (!pkg) {
    return NextResponse.json({ error: 'Unbekanntes Paket.' }, { status: 400 })
  }

  // Get or create Stripe customer
  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  let customerId = user?.stripeCustomerId

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
      metadata: { userId: session.user.id },
    })
    customerId = customer.id
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${pkg.label} – ${pkg.credits} Credits`,
            description: `${pkg.credits} Credits für Bewerber-Schmiede`,
          },
          unit_amount: pkg.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${appUrl}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/de/app`,
    metadata: {
      userId: session.user.id,
      packageId,
      credits: pkg.credits.toString(),
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
