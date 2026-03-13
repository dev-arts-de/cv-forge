import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse(null, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  })

  if (!user?.image) return new NextResponse(null, { status: 404 })

  // Handle base64 data URLs: "data:image/jpeg;base64,..."
  const match = user.image.match(/^data:([^;]+);base64,(.+)$/)
  if (match) {
    const mimeType = match[1]
    const buffer = Buffer.from(match[2], 'base64')
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  }

  // Regular URL — redirect
  return NextResponse.redirect(user.image)
}
