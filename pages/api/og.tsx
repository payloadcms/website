import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : ''
    const hasTopic = searchParams.has('topic')
    const topic = hasTopic ? searchParams.get('topic')?.slice(0, 100).replace('-', ' ') : ''

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <svg width="100" height="100" viewBox="0 0 260 260" fill="#0F0F0F">
            <path d="M120.59 8.5824L231.788 75.6142V202.829L148.039 251.418V124.203L36.7866 57.2249L120.59 8.5824Z" />
            <path d="M112.123 244.353V145.073L28.2114 193.769L112.123 244.353Z" />
          </svg>
          <div
            style={{
              textTransform: 'capitalize',
              marginTop: 50,
            }}
          >
            {topic && topic}
          </div>
          <div
            style={{
              marginTop: 25,
              fontSize: 32,
              textTransform: 'capitalize',
            }}
          >
            {title && title}
          </div>
        </div>
      ),
      {
        width: 800,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
