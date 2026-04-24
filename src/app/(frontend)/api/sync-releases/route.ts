import { syncReleases } from '@root/scripts/fetchReleases'
import { NextResponse } from 'next/server'

export const maxDuration = 300 // 5 mins (max on vercel pro plan)
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  try {
    const result = await syncReleases(20)
    return NextResponse.json({ success: true, ...result }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message, success: false }, { status: 500 })
  }
}
