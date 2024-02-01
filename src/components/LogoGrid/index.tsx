import React, { useEffect, useState } from 'react'

import { Media } from '@components/Media'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'
import { Media as MediaType } from '@root/payload-types'

import classes from './index.module.scss'

interface LogoItem {
  logo: string | MediaType
  id?: string | null
}

interface PositionedLogo {
  logo: LogoItem
  position: number
  isVisible: boolean
}

interface Props {
  logos: LogoItem[] | null | undefined
}

const TOTAL_CELLS = 12
const ANIMATION_DURATION = 500 // Duration for fade-out and fade-in in milliseconds
const ANIMATION_DELAY = 1500 // Delay between animations in milliseconds

const getRandomPosition = (excludePositions: number[]) => {
  let newPos
  const excludedCells = [0, 11] // Exclude first and last cells
  do {
    newPos = Math.floor(Math.random() * TOTAL_CELLS)
  } while (excludePositions.includes(newPos) || excludedCells.includes(newPos))
  return newPos
}

export const LogoGrid: React.FC<Props> = ({ logos }) => {
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
    <div className={classes.logoGrid}>
      <div
        className={[classes.horizontalLine, classes.topHorizontalLine].filter(Boolean).join(' ')}
      />
      {[...Array(2)].map((_, idx) => (
        <div
          key={`h-line-${idx}`}
          className={classes.horizontalLine}
          style={{ top: `${(idx + 1) * 33.333}%` }}
        />
      ))}
      {[...Array(3)].map((_, idx) => {
        if (idx === 1) return null // Skip the line at left: 50%
        return (
          <div
            key={`v-line-${idx}`}
            className={classes.verticalLine}
            style={{ left: `${(idx + 1) * 25}%` }}
          />
        )
      })}
      <div
        className={[classes.horizontalLine, classes.bottomHorizontalLine].filter(Boolean).join(' ')}
      />
      {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
        <div className={classes.logoGridItem} key={index}>
          <div className={classes.contentWrapper}>
            {logoPositions
              .filter(item => item.position === index)
              .map(({ logo, isVisible }, idx) => (
                <div
                  key={idx}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transition: `opacity ${ANIMATION_DURATION}ms ease`,
                  }}
                >
                  {typeof logo.logo === 'object' && logo.logo !== null && (
                    <Media resource={logo.logo} />
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      <CrosshairIcon className={[classes.crosshair, classes.crosshairBottomLeft].join(' ')} />
      <CrosshairIcon className={[classes.crosshair, classes.crosshairTopRight].join(' ')} />
      <CrosshairIcon className={[classes.crosshair, classes.crosshairFirstCell].join(' ')} />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairSecondRowThirdCell].join(' ')}
      />
    </div>
  )
}

export default LogoGrid
