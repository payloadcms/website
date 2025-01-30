import type { NextRequest } from 'next/server'

import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const collection = request.nextUrl.searchParams.get('collection')
  const slug = request.nextUrl.searchParams.get('slug')
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.NEXT_PRIVATE_REVALIDATION_KEY) {
    return NextResponse.json({ now: Date.now(), revalidated: false })
  }

  if (typeof collection === 'string' && typeof slug === 'string') {
    revalidateTag(`${collection}_${slug}`)
    return NextResponse.json({ now: Date.now(), revalidated: true })
  }

  return NextResponse.json({ now: Date.now(), revalidated: false })
}
