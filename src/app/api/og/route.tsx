import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest): Promise<ImageResponse> {
  try {
    // Make sure the font exists in the specified path:
    const untitledSansFont = await fetch(
      new URL('../../../../public/fonts/UntitledSans-Regular.woff2', import.meta.url),
    ).then(res => res.arrayBuffer())

    const robotoFont = await fetch(
      new URL('../../../../public/fonts/RobotoMono-Regular.woff', import.meta.url),
    ).then(res => res.arrayBuffer())

    const { searchParams } = new URL(req.url)
    const untitledSans = await untitledSansFont
    const roboto = await robotoFont

    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : ''
    const titlePerWord = title?.trim()?.split(' ')
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
            justifyContent: 'space-between',
            backgroundColor: '#000',
            color: '#fff',
            padding: '100px',
            fontFamily: 'UntiledSans',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textTransform: 'capitalize',
              fontSize: 50,
            }}
          >
            {topic && topic}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: 90,
                lineHeight: 1,
                marginTop: '10px,',
              }}
            >
              {titlePerWord?.map((word, i) => {
                return (
                  <span
                    key={i}
                    style={{
                      display: 'flex',
                      position: 'relative',
                      color: '#B6FFE0',
                      paddingRight: '15px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: ' ',
                        top: 55,
                        bottom: 0,
                        left: -15,
                        right: 0,
                        backgroundColor: '#1B2622',
                      }}
                    />
                    {word}
                  </span>
                )
              })}
            </div>
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/fullLogo.png`}
              alt="Payload CMS"
              width="300"
              height="70"
            />
            <div
              style={{
                textTransform: 'uppercase',
                letterSpacing: '4px',
                fontSize: 20,
                fontFamily: 'Roboto',
              }}
            >
              Documentation
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'UntitledSans',
            data: untitledSans,
          },
          {
            name: 'Roboto',
            data: roboto,
          },
        ],
      },
    )
  } catch (e: any) {
    console.error(`${e.message}`) // eslint-disable-line no-console
    return NextResponse.error()
  }
}
