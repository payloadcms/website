import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media/index'
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

type Props = {
  logos: LogoItem[] | null | undefined
}

const TOTAL_CELLS = 12
const ANIMATION_DURATION = 650 // Duration for fade-out and fade-in in milliseconds
const ANIMATION_DELAY = 650 // Delay between animations in milliseconds

const getRandomPosition = (excludePositions: number[]) => {
  let newPos
  const excludedCells = [0, 11] // Exclude first and last cells
  do {
    newPos = Math.floor(Math.random() * TOTAL_CELLS)
  } while (excludePositions.includes(newPos) || excludedCells.includes(newPos))
  return newPos
}

export const LogoShowcase: React.FC<Props> = ({ logos }) => {
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
    <div className={classes.logoShowcase}>
      <div
        className={[classes.horizontalLine, classes.topHorizontalLine].filter(Boolean).join(' ')}
      />
      {[...Array(2)].map((_, idx) => (
        <div
          className={classes.horizontalLine}
          key={`h-line-${idx}`}
          style={{ top: `${(idx + 1) * 33.333}%` }}
        />
      ))}
      {[...Array(3)].map((_, idx) => {
        return (
          <div
            className={idx === 1 ? classes.verticalLineNoDesktop : classes.verticalLine}
            key={`v-line-${idx}`}
            style={{ left: `${(idx + 1) * 25}%` }}
          />
        )
      })}
      <div
        className={[classes.horizontalLine, classes.bottomHorizontalLine].filter(Boolean).join(' ')}
      />
      {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
        const hasLogo = logoPositions.some((item) => item.position === index && item.isVisible)
        // Determine if the current cell is the first or last cell
        const isEdgeCell = index === 0 || index === TOTAL_CELLS - 1
        return (
          <div
            className={[
              classes.logoShowcaseItem,
              hasLogo ? classes.logoPresent : isEdgeCell ? classes.noScanline : '',
            ]
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
      <CrosshairIcon className={[classes.crosshair, classes.crosshairBottomLeft].join(' ')} />
      <CrosshairIcon className={[classes.crosshair, classes.crosshairTopRight].join(' ')} />
      <CrosshairIcon className={[classes.crosshair, classes.crosshairFirstCell].join(' ')} />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairSecondRowThirdCell].join(' ')}
      />
    </div>
  )
}

export default LogoShowcase
