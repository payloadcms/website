import { NextResponse } from 'next/server'

import fetchDiscord from '../../../../scripts/fetchDiscord'
import fetchGitHub from '../../../../scripts/fetchGitHub'
import syncToAlgolia from '../../../../scripts/syncToAlgolia'

export const maxDuration = 60 * 15 // 15 mins
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  await fetchDiscord()
  await fetchGitHub()
  await syncToAlgolia()

  return NextResponse.json((JSON.stringify({ success: true }), { status: 200 }))
}
