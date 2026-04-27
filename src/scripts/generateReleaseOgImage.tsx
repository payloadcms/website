import fs from 'fs'
import { ImageResponse } from 'next/og'
import path from 'path'

export async function generateReleaseOgImage(version: string): Promise<Buffer> {
  const fontDir = path.join(process.cwd(), 'public/fonts')
  const untitledSansRegular = fs.readFileSync(path.join(fontDir, 'UntitledSans-Regular.woff'))
  const untitledSansMedium = fs.readFileSync(path.join(fontDir, 'UntitledSans-Medium.woff'))
  const robotoMono = fs.readFileSync(path.join(fontDir, 'RobotoMono-Regular.woff'))
  const bgImage = fs.readFileSync(path.join(process.cwd(), 'public/images/release-notes-bg.jpg'))
  const bgDataUrl = `data:image/jpeg;base64,${bgImage.toString('base64')}`
  const scanline = fs.readFileSync(path.join(process.cwd(), 'public/images/scanline-light.png'))
  const scanlineDataUrl = `data:image/png;base64,${scanline.toString('base64')}`
  const favicon = fs.readFileSync(path.join(process.cwd(), 'public/images/favicon-light.png'))
  const faviconDataUrl = `data:image/png;base64,${favicon.toString('base64')}`

  const response = new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          height: '100%',
          padding: 75,
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundImage: `url(${bgDataUrl})`,
            backgroundSize: 'cover',
            bottom: 0,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        />
        <div
          style={{
            backgroundImage: `url(${scanlineDataUrl})`,
            backgroundRepeat: 'repeat',
            bottom: 0,
            left: 0,
            opacity: 0.08,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        />
        {Array.from({ length: 6 }).map((_, i) => {
          const linePositions = [
            { bottom: 0, left: 75, top: 0, width: 1 },
            { bottom: 0, left: '50%', top: 0, width: 1 },
            { bottom: 0, right: 75, top: 0, width: 1 },
            { height: 1, left: 0, right: 0, top: 75 },
            { height: 1, left: 0, right: 0, top: '50vh' },
            { bottom: 75, height: 1, left: 0, right: 0 },
          ]
          return (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                position: 'absolute',
                ...linePositions[i],
              }}
            />
          )
        })}
        <div
          style={{
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'UntitledSansRegular',
            height: '100%',
            justifyContent: 'space-between',
            padding: 65,
            position: 'relative',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'UntitledSansMedium',
                fontSize: 96,
                fontWeight: 500,
                letterSpacing: '-0.05em',
                lineHeight: 1,
              }}
            >
              <span>New</span>
              <span>Release</span>
            </div>
            <div
              style={{
                fontFamily: 'RobotoMono',
                fontSize: 28,
                letterSpacing: '0.02em',
                opacity: 0.7,
              }}
            >
              {version}
            </div>
          </div>
          <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 30 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Payload CMS"
              height="40"
              src={faviconDataUrl}
              width="40"
            />
          </div>
          {Array.from({ length: 2 }).map((_, i) => {
            const crosshairPosition =
              i === 0
                ? { left: 0, top: 0, transform: 'translate(-50%, -50%)' }
                : { bottom: 0, right: 0, transform: 'translate(50%, 50%)' }
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  opacity: 0.5,
                  position: 'absolute',
                  ...crosshairPosition,
                }}
              >
                <svg
                  fill="none"
                  height="21"
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 20 21"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
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
      fonts: [
        { name: 'UntitledSansRegular', data: untitledSansRegular, weight: 400 },
        { name: 'UntitledSansMedium', data: untitledSansMedium, weight: 500 },
        { name: 'RobotoMono', data: robotoMono, weight: 400 },
      ],
      height: 630,
      width: 1200,
    },
  )

  return Buffer.from(await response.arrayBuffer())
}
