import { Gutter } from '@components/Gutter'
import { PixelBackground } from '@components/PixelBackground'
import React from 'react'
import { StyleguidePageContent } from '../PageContent'

const elevations = [
  '50',
  '100',
  '150',
  '200',
  '250',
  '300',
  '350',
  '400',
  '450',
  '500',
  '550',
  '600',
  '650',
  '700',
  '750',
  '800',
  '850',
  '900',
  '950',
  '1000',
]

const Colors: React.FC = () => {
  return (
    <StyleguidePageContent title="Colors">
      <Gutter>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            margin: 'calc(var(--base) * -1.25)',
            padding: 'calc(var(--base))',
          }}
        >
          {elevations.map(elevation => (
            <div
              style={{
                backgroundColor: `var(--theme-elevation-${elevation})`,
                width: 'calc(var(--base) * 4)',
                height: 'calc(var(--base) * 4)',
                margin: 'calc(var(--base) / 4)',
                padding: 'calc(var(--base) / 2)',
              }}
            >
              <p
                style={{
                  fontSize: 'small',
                  lineHeight: 1,
                  margin: '0',
                  color:
                    parseInt(elevation, 10) > 500
                      ? 'var(--theme-elevation-50)'
                      : 'var(--theme-text)',
                }}
              >{`var(--theme-elevation-${elevation})`}</p>
            </div>
          ))}
        </div>
        <br />
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'calc(var(--base) * 8)',
          }}
        >
          <PixelBackground />
        </div>
      </Gutter>
    </StyleguidePageContent>
  )
}

export default Colors
