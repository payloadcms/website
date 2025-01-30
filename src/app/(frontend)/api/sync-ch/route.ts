import clearDuplicateThreads from '@root/scripts/clearDuplicateThreads'
import { NextResponse } from 'next/server'

import fetchDiscord from '../../../../scripts/fetchDiscord'
import fetchGitHub from '../../../../scripts/fetchGitHub'
import syncToAlgolia from '../../../../scripts/syncToAlgolia'

export const maxDuration = 300 // 5 mins (max on vercel pro plan)
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const tasks = [
    { name: 'clearDuplicateThreads', fn: clearDuplicateThreads },
    { name: 'fetchDiscord', fn: fetchDiscord },
    { name: 'fetchGitHub', fn: fetchGitHub },
    { name: 'syncToAlgolia', fn: syncToAlgolia },
  ]

  // Execute each task, catch errors, and log them
  for (const { name, fn } of tasks) {
    try {
      await fn()
    } catch (error) {
      console.error(`Error in ${name}:`, error)
    }
  }

  return NextResponse.json((JSON.stringify({ success: true }), { status: 200 }))
}
