import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_CVS = 2

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

// GET /api/cvs → list user's saved CVs
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const cvs = await prisma.savedCV.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true, text: true },
    orderBy: [{ lastUsedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
  })

  return NextResponse.json({ cvs })
}

// POST /api/cvs { name, text } → save or update CV
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { name, text } = await req.json() as { name?: string; text?: string }
  if (!text?.trim()) return NextResponse.json({ error: 'Kein Text.' }, { status: 400 })

  const normalized = normalizeText(text)

  // Fetch all existing CVs for this user
  const all = await prisma.savedCV.findMany({
    where: { userId: session.user.id },
    orderBy: [{ lastUsedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
  })

  // Check for duplicate by normalized text comparison
  const duplicate = all.find((c) => normalizeText(c.text) === normalized)

  if (duplicate) {
    const updated = await prisma.savedCV.update({
      where: { id: duplicate.id },
      data: { lastUsedAt: new Date(), name: name?.trim() || duplicate.name },
      select: { id: true, name: true, createdAt: true, lastUsedAt: true },
    })
    return NextResponse.json({ cv: updated })
  }

  // Delete all that would exceed MAX_CVS after inserting one more
  const toDelete = all.slice(MAX_CVS - 1) // keep only MAX_CVS-1 oldest, new one will be most recent
  if (toDelete.length > 0) {
    await prisma.savedCV.deleteMany({ where: { id: { in: toDelete.map((c) => c.id) } } })
  }

  const cvName = name?.trim() || `Lebenslauf ${new Date().toLocaleDateString('de-DE')}`
  const cv = await prisma.savedCV.create({
    data: { userId: session.user.id, name: cvName, text: normalized, lastUsedAt: new Date() },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true },
  })

  return NextResponse.json({ cv }, { status: 201 })
}
