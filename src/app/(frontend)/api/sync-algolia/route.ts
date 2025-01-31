import { NextResponse } from 'next/server'

import syncToAlgolia from '../../../../scripts/syncToAlgolia'

export async function GET(): Promise<NextResponse> {
  await syncToAlgolia()

  return NextResponse.json((JSON.stringify({ success: true }), { status: 200 }))
}
