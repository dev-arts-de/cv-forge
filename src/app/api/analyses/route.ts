import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { FullAnalysisResult } from '@/types'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      cvFileName: true,
      jobTitle: true,
      overallScore: true,
      createdAt: true,
    },
  })

  return NextResponse.json(analyses)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })

  const body = await req.json() as {
    result: FullAnalysisResult
    cvFileName?: string
    cvText?: string
    jobText?: string
    coverLetterText?: string
  }

  const jobTitle = body.jobText
    ? body.jobText.split('\n').find(l => l.trim().length > 5 && l.trim().length < 80)?.trim() ?? null
    : null

  const analysis = await prisma.analysis.create({
    data: {
      userId: session.user.id,
      cvFileName: body.cvFileName ?? null,
      jobTitle,
      overallScore: body.result.cv_analysis?.overall_score ?? null,
      result: body.result as object,
      cvText: body.cvText ?? null,
      jobText: body.jobText ?? null,
      coverLetterText: body.coverLetterText ?? null,
    },
    select: { id: true },
  })

  return NextResponse.json({ id: analysis.id })
}
