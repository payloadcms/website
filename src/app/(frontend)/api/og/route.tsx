import { ImageResponse } from 'next/og'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest): Promise<ImageResponse> {
  try {
    // Make sure the font exists in the specified path:
    const untitledSansRegularFont = await fetch(
      new URL('../../../../../public/fonts/UntitledSans-Regular.woff', import.meta.url),
    ).then(res => res.arrayBuffer())

    const untitledSansMediumFont = await fetch(
      new URL('../../../../../public/fonts/UntitledSans-Medium.woff', import.meta.url),
    ).then(res => res.arrayBuffer())

    const robotoFont = await fetch(
      new URL('../../../../../public/fonts/RobotoMono-Regular.woff', import.meta.url),
    ).then(res => res.arrayBuffer())

    const { searchParams } = new URL(req.url)
    const untitledSansRegular = await untitledSansRegularFont
    const untitledSansMedium = await untitledSansMediumFont
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
            backgroundColor: '#000',
            color: '#fff',
            padding: 75,
            display: 'flex',
            position: 'relative',
          }}
        >
          {/* BG lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const linePositions = [
              { top: 0, bottom: 0, left: 75, width: 1 },
              { top: 0, bottom: 0, left: '50%', width: 1 },
              { top: 0, bottom: 0, right: 75, width: 1 },
              { left: 0, right: 0, top: 75, height: 1 },
              { left: 0, right: 0, top: '50vh', height: 1 },
              { left: 0, right: 0, bottom: 75, height: 1 },
            ]

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  background: 'rgba(255, 255, 255, 0.1)',
                  ...linePositions[i],
                }}
              />
            )
          })}
          <div
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000',
              color: '#fff',
              display: 'flex',
              position: 'absolute',
              backgroundImage: `url(${process.env.NEXT_PUBLIC_SITE_URL}/images/scanline-light.png)`,
              opacity: 0.08,
              backgroundRepeat: 'repeat',
            }}
          />
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 65,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'UntitledSansRegular',
              backgroundColor: '#000',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                textTransform: 'capitalize',
                fontSize: 28,
                letterSpacing: '-0.56px',
                lineHeight: 1.2,
              }}
            >
              {topic && topic}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  fontFamily: 'UntitledSansMedium',
                  letterSpacing: '-0.05em',
                  fontSize: 72,
                  lineHeight: 1,
                  marginTop: 20,
                  fontWeight: 500,
                }}
              >
                {titlePerWord?.map((word, i) => {
                  return (
                    <span
                      key={i}
                      style={{
                        display: 'flex',
                        position: 'relative',
                        paddingRight: '15px',
                      }}
                    >
                      {word}
                    </span>
                  )
                })}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 30,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/favicon-light.svg`}
                alt="Payload CMS"
                width="40"
                height="40"
              />
              <div
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '4px',
                  fontSize: 20,
                }}
              >
                Documentation
              </div>
            </div>

            {/* Crosshairs */}
            {Array.from({ length: 2 }).map((_, i) => {
              const crosshairPosition =
                i === 0
                  ? { top: 0, left: 0, transform: 'translate(-50%, -50%)' }
                  : { bottom: 0, right: 0, transform: 'translate(50%, 50%)' }

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    opacity: 0.5,
                    ...crosshairPosition,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M10 0.332031V20.332" />
                    <path d="M0 10.332L20 10.332" />
                  </svg>
                </div>
              )
            })}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'UntitledSansRegular',
            data: untitledSansRegular,
            weight: 400,
          },
          {
            name: 'UntitledSansMedium',
            data: untitledSansMedium,
            weight: 500,
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
