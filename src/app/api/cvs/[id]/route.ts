import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/cvs/[id] { name } → rename
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { id } = await params
  const { name } = await req.json() as { name?: string }
  if (!name?.trim()) return NextResponse.json({ error: 'Kein Name.' }, { status: 400 })

  const cv = await prisma.savedCV.findFirst({ where: { id, userId: session.user.id } })
  if (!cv) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })

  const updated = await prisma.savedCV.update({
    where: { id },
    data: { name: name.trim() },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true },
  })
  return NextResponse.json({ cv: updated })
}

// DELETE /api/cvs/[id] → delete
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { id } = await params
  const cv = await prisma.savedCV.findFirst({ where: { id, userId: session.user.id } })
  if (!cv) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })

  await prisma.savedCV.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
