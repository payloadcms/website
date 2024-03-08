'use client'

import React, { useEffect, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'
import { Media as MediaType, Page } from '@root/payload-types'

import classes from './index.module.scss'

type LogoItem = {
  logoMedia: string | MediaType
  id?: string | null
}

type PositionedLogo = {
  logo: LogoItem
  position: number
  isVisible: boolean
}

export type LogoGridProps = Extract<Page['layout'][0], { blockType: 'logoGrid' }> & {
  padding?: PaddingProps
}

const TOTAL_CELLS = 8
const ANIMATION_DURATION = 650 // Duration for fade-out and fade-in in milliseconds
const ANIMATION_DELAY = 650 // Delay between animations in milliseconds

const getRandomPosition = (excludePositions: number[]) => {
  let newPos
  do {
    newPos = Math.floor(Math.random() * TOTAL_CELLS)
  } while (excludePositions.includes(newPos))
  return newPos
}

export const LogoGrid: React.FC<LogoGridProps> = ({ logoGridFields, padding }) => {
  const { richText, enableLink, link, logos, settings } = logoGridFields

  const [logoPositions, setLogoPositions] = useState<PositionedLogo[]>([])
  const [currentAnimatingIndex, setCurrentAnimatingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (logos) {
      let occupiedPositions: number[] = []
      const initialPositions = logos.map(logo => {
        const position = getRandomPosition(occupiedPositions)
        occupiedPositions.push(position)
        return { logo, position, isVisible: true }
      })
      setLogoPositions(initialPositions)
    }
  }, [logos])

  useEffect(() => {
    if (!logos || logos.length === 0 || logos.length > TOTAL_CELLS) return

    /* eslint-disable function-paren-newline */
    const animateLogo = () => {
      const logoIndex =
        currentAnimatingIndex !== null ? (currentAnimatingIndex + 1) % logos.length : 0
      setCurrentAnimatingIndex(logoIndex)

      setLogoPositions(prevPositions =>
        prevPositions.map((pos, idx) => (idx === logoIndex ? { ...pos, isVisible: false } : pos)),
      )

      setTimeout(() => {
        setLogoPositions(prevPositions => {
          const occupiedPositions = prevPositions.map(p => p.position)
          let newPosition
          do {
            newPosition = getRandomPosition(occupiedPositions)
          } while (newPosition === prevPositions[logoIndex].position)

          return prevPositions.map((pos, idx) =>
            idx === logoIndex ? { ...pos, position: newPosition, isVisible: false } : pos,
          )
        })

        setTimeout(() => {
          setLogoPositions(prevPositions =>
            prevPositions.map((pos, idx) =>
              idx === logoIndex ? { ...pos, isVisible: true } : pos,
            ),
          )
        }, 100)
      }, ANIMATION_DURATION + 500)
    }
    /* eslint-enable function-paren-newline */

    const interval = setInterval(animateLogo, ANIMATION_DELAY + ANIMATION_DURATION)
    return () => clearInterval(interval)
  }, [logoPositions, currentAnimatingIndex, logos])

  return (
    <BlockWrapper
      className={[classes.logoGrid].filter(Boolean).join(' ')}
      padding={padding}
      settings={settings}
    >
      <Gutter>
        <BackgroundGrid className={classes.backgroundGrid} zIndex={0} />
        <div className={[classes.logoGridContentWrapper, 'grid'].filter(Boolean).join(' ')}>
          <div className={[classes.richTextWrapper, 'cols-8 start-1'].filter(Boolean).join(' ')}>
            <RichText className={classes.richText} content={richText} />
            {enableLink && link && (
              <div className={classes.link}>
                <CMSLink
                  {...link}
                  appearance="default"
                  fullWidth
                  buttonProps={{
                    icon: 'arrow',
                    hideHorizontalBorders: true,
                  }}
                />
              </div>
            )}
          </div>
          <div
            className={[classes.logoWrapper, 'cols-8 start-9 start-m-1'].filter(Boolean).join(' ')}
          >
            <div className={classes.logoShowcase}>
              <div className={[classes.horizontalLine, classes.topHorizontalLine].join(' ')} />
              <div className={classes.horizontalLine} style={{ top: '50%' }} />
              {[...Array(3)].map((_, idx) => {
                if (idx === 1) return null
                return (
                  <div
                    key={`v-line-${idx}`}
                    className={classes.verticalLine}
                    style={{ left: `${(idx + 1) * 25}%` }}
                  />
                )
              })}
              <div className={[classes.horizontalLine, classes.bottomHorizontalLine].join(' ')} />
              {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
                const hasLogo = logoPositions.some(
                  item => item.position === index && item.isVisible,
                )
                return (
                  <div
                    className={[classes.logoShowcaseItem, hasLogo ? classes.logoPresent : '']
                      .filter(Boolean)
                      .join(' ')}
                    key={index}
                  >
                    <div className={classes.contentWrapper}>
                      {logoPositions
                        .filter(item => item.position === index)
                        .map(({ logo, isVisible }, idx) => (
                          <div
                            key={idx}
                            style={{
                              opacity: isVisible ? 1 : 0,
                              transition: `opacity ${ANIMATION_DURATION}ms ease, filter ${ANIMATION_DURATION}ms ease`,
                              filter: isVisible ? 'blur(0px)' : 'blur(8px)',
                            }}
                          >
                            {typeof logo.logoMedia === 'object' && logo.logoMedia !== null && (
                              <Media resource={logo.logoMedia} />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )
              })}
              <CrosshairIcon className={[classes.crosshair, classes.crosshairLeft].join(' ')} />
              <CrosshairIcon className={[classes.crosshair, classes.crosshairRight].join(' ')} />
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
