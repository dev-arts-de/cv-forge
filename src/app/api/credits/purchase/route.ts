import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const PACKAGES = {
  starter:  { credits: 5,  label: 'Starter',  price: 1.99 },
  standard: { credits: 15, label: 'Standard', price: 4.99 },
  pro:      { credits: 35, label: 'Pro',       price: 9.99 },
} as const

export type PackageId = keyof typeof PACKAGES

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const { packageId } = await req.json() as { packageId: PackageId }
  const pkg = PACKAGES[packageId]
  if (!pkg) {
    return NextResponse.json({ error: 'Unbekanntes Paket.' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { credits: { increment: pkg.credits } },
    select: { credits: true },
  })

  return NextResponse.json({ credits: updated.credits, added: pkg.credits })
}
