import { NextResponse } from 'next/server.js'

export const revalidate = 900

export async function GET(): Promise<NextResponse> {
  const { stargazers_count: totalStars } = await fetch(
    'https://api.github.com/repos/payloadcms/payload',
  ).then(res => res.json())

  return NextResponse.json({ totalStars })
}
