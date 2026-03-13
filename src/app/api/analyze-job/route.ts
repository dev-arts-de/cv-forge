import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Premium feature — not yet implemented
  return NextResponse.json(
    { error: 'premium_required', message: 'This feature requires a Premium subscription' },
    { status: 402 }
  )
}
