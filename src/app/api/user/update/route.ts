import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  let body: { name?: string; image?: string }
  try {
    body = await req.json() as { name?: string; image?: string }
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
  }

  const updateData: { name?: string; image?: string } = {}
  if (typeof body.name === 'string') updateData.name = body.name.trim()
  if (typeof body.image === 'string') updateData.image = body.image

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: { id: true, name: true, email: true, image: true, credits: true },
  })

  return NextResponse.json({ user: updated })
}
