import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const COSTS = { analysis: 3, cover_letter: 2 } as const

// GET /api/credits → current balance
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  })
  return NextResponse.json({ credits: user?.credits ?? 0 })
}

// POST /api/credits { action: 'analysis' | 'cover_letter' } → spend credits
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { action } = await req.json() as { action: keyof typeof COSTS }
  const cost = COSTS[action]
  if (!cost) return NextResponse.json({ error: 'Unbekannte Aktion.' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'User nicht gefunden.' }, { status: 404 })

  if (user.credits < cost) {
    return NextResponse.json({ error: 'Nicht genug Credits.', credits: user.credits }, { status: 402 })
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { credits: { decrement: cost } },
  })
  return NextResponse.json({ credits: updated.credits })
}

// PUT /api/credits { action: 'analysis' | 'cover_letter' } → refund credits after a failed operation
export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { action } = await req.json() as { action: keyof typeof COSTS }
  const cost = COSTS[action]
  if (!cost) return NextResponse.json({ error: 'Unbekannte Aktion.' }, { status: 400 })

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { credits: { increment: cost } },
  })
  return NextResponse.json({ credits: updated.credits })
}
