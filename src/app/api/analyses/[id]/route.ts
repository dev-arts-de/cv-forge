import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { id } = await params
  const analysis = await prisma.analysis.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!analysis) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })

  return NextResponse.json(analysis)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { id } = await params
  await prisma.analysis.deleteMany({ where: { id, userId: session.user.id } })

  return NextResponse.json({ ok: true })
}
