import React, { useEffect, useState } from 'react'

import { Media } from '@components/Media'
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
const ANIMATION_DURATION = 1000 // Duration for fade-out and fade-in in milliseconds
const ANIMATION_DELAY = 3000 // Delay between animations in milliseconds

const getRandomPosition = (excludePositions: number[]) => {
  let newPos
  do {
    newPos = Math.floor(Math.random() * TOTAL_CELLS)
  } while (excludePositions.includes(newPos))
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

    const animateLogo = () => {
      const logoIndex =
        currentAnimatingIndex !== null ? (currentAnimatingIndex + 1) % logos.length : 0
      setCurrentAnimatingIndex(logoIndex)

      const newPositions = [...logoPositions]
      newPositions[logoIndex].isVisible = false // Start fade-out
      setLogoPositions(newPositions)

      setTimeout(() => {
        const newPosition = getRandomPosition(
          newPositions
            .map(item => item.position)
            .filter(pos => pos !== newPositions[logoIndex].position),
        )
        newPositions[logoIndex] = {
          ...newPositions[logoIndex],
          position: newPosition,
          isVisible: false,
        } // Move to new position but keep invisible
        setLogoPositions(newPositions)

        setTimeout(() => {
          newPositions[logoIndex].isVisible = true // Start fade-in
          setLogoPositions(newPositions)
        }, ANIMATION_DURATION / 2)
      }, ANIMATION_DURATION)
    }

    const interval = setInterval(animateLogo, ANIMATION_DELAY + ANIMATION_DURATION)
    return () => clearInterval(interval)
  }, [logoPositions, currentAnimatingIndex, logos])

  return (
    <div className={classes.logoGrid}>
      {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
        <div className={classes.logoGridItem} key={index}>
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
      ))}
    </div>
  )
}
