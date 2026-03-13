import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const letters = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, jobTitle: true, text: true, createdAt: true, analysisId: true },
  })

  return NextResponse.json(letters)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const { text, jobTitle, analysisId } = await req.json() as {
    text: string
    jobTitle?: string
    analysisId?: string
  }

  if (!text?.trim()) return NextResponse.json({ error: 'Kein Text.' }, { status: 400 })

  const letter = await prisma.coverLetter.create({
    data: {
      userId: session.user.id,
      text,
      jobTitle: jobTitle ?? null,
      analysisId: analysisId ?? null,
    },
    select: { id: true },
  })

  return NextResponse.json({ id: letter.id })
}
