'use client'

import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Media as MediaType, Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { RichText } from '@components/RichText/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import React, { useEffect, useState } from 'react'

import classes from './index.module.scss'

type LogoItem = {
  id?: null | string
  logoMedia: MediaType | string
}

type PositionedLogo = {
  isVisible: boolean
  logo: LogoItem
  position: number
}

export type LogoGridProps = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'logoGrid' }>

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

export const LogoGrid: React.FC<LogoGridProps> = ({ hideBackground, logoGridFields, padding }) => {
  const { enableLink, link, logos, richText, settings } = logoGridFields

  const [logoPositions, setLogoPositions] = useState<PositionedLogo[]>([])
  const [currentAnimatingIndex, setCurrentAnimatingIndex] = useState<null | number>(null)

  useEffect(() => {
    if (logos) {
      const occupiedPositions: number[] = []
      const initialPositions = logos.map((logo) => {
        const position = getRandomPosition(occupiedPositions)
        occupiedPositions.push(position)
        return { isVisible: true, logo, position }
      })
      setLogoPositions(initialPositions)
    }
  }, [logos])

  useEffect(() => {
    if (!logos || logos.length === 0 || logos.length > TOTAL_CELLS) {
      return
    }

    const animateLogo = () => {
      const logoIndex =
        currentAnimatingIndex !== null ? (currentAnimatingIndex + 1) % logos.length : 0
      setCurrentAnimatingIndex(logoIndex)

      setLogoPositions((prevPositions) =>
        prevPositions.map((pos, idx) => (idx === logoIndex ? { ...pos, isVisible: false } : pos)),
      )

      setTimeout(() => {
        setLogoPositions((prevPositions) => {
          const occupiedPositions = prevPositions.map((p) => p.position)
          let newPosition
          do {
            newPosition = getRandomPosition(occupiedPositions)
          } while (newPosition === prevPositions[logoIndex].position)

          return prevPositions.map((pos, idx) =>
            idx === logoIndex ? { ...pos, isVisible: false, position: newPosition } : pos,
          )
        })

        setTimeout(() => {
          setLogoPositions((prevPositions) =>
            prevPositions.map((pos, idx) =>
              idx === logoIndex ? { ...pos, isVisible: true } : pos,
            ),
          )
        }, 100)
      }, ANIMATION_DURATION + 500)
    }

    const interval = setInterval(animateLogo, ANIMATION_DELAY + ANIMATION_DURATION)
    return () => clearInterval(interval)
  }, [logoPositions, currentAnimatingIndex, logos])

  return (
    <BlockWrapper
      className={[classes.logoGrid].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
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
                  buttonProps={{
                    hideHorizontalBorders: true,
                    icon: 'arrow',
                  }}
                  fullWidth
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
                if (idx === 1) {
                  return null
                }
                return (
                  <div
                    className={classes.verticalLine}
                    key={`v-line-${idx}`}
                    style={{ left: `${(idx + 1) * 25}%` }}
                  />
                )
              })}
              <div className={[classes.horizontalLine, classes.bottomHorizontalLine].join(' ')} />
              {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
                const hasLogo = logoPositions.some(
                  (item) => item.position === index && item.isVisible,
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
                        .filter((item) => item.position === index)
                        .map(({ isVisible, logo }, idx) => (
                          <div
                            key={idx}
                            style={{
                              filter: isVisible ? 'blur(0px)' : 'blur(8px)',
                              opacity: isVisible ? 1 : 0,
                              transition: `opacity ${ANIMATION_DURATION}ms ease, filter ${ANIMATION_DURATION}ms ease`,
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
