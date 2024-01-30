import React, { useEffect, useState } from 'react'

import { Media } from '@components/Media'
import { Media as MediaType } from '@root/payload-types'

import classes from './index.module.scss'

interface LogoItem {
  logo: string | MediaType
  id?: string | null
}

interface PositionedLogo extends LogoItem {
  position: number
  isVisible: boolean
}

interface LogoGroup {
  logos?: LogoItem[] | null
}

interface Props {
  logoGroup?: LogoGroup
  className?: string
}

const getRandomPosition = (excludePositions: number[]) => {
  let newPos
  do {
    newPos = Math.floor(Math.random() * 12) // 12 grid positions
  } while (excludePositions.includes(newPos))
  return newPos
}

export const LogoGrid: React.FC<Props> = ({ logoGroup }) => {
  const [logoPositions, setLogoPositions] = useState<PositionedLogo[]>([])

  useEffect(() => {
    if (logoGroup?.logos) {
      // Initialize logos in random positions
      let occupiedPositions: number[] = []
      const initialPositions = logoGroup.logos.map(logo => {
        const position = getRandomPosition(occupiedPositions)
        occupiedPositions.push(position)
        return { ...logo, position, isVisible: true }
      })
      setLogoPositions(initialPositions)

      // Sequentially update each logo's position
      const updateLogoPositions = () => {
        logoGroup.logos.forEach((_, index) => {
          setTimeout(() => {
            setLogoPositions(prev => {
              const newPositions = [...prev]
              const newPosition = getRandomPosition(
                newPositions
                  .map(item => item.position)
                  .filter(p => p !== newPositions[index].position),
              )
              newPositions[index] = {
                ...newPositions[index],
                position: newPosition,
                isVisible: false,
              }

              setTimeout(() => {
                newPositions[index].isVisible = true
                setLogoPositions(newPositions)
              }, 1000) // Delay for fade-in

              return newPositions
            })
          }, 3000 * index) // Stagger the timing for each logo
        })
      }

      updateLogoPositions()
    }
  }, [logoGroup?.logos])

  return (
    <div className={classes.logoGrid}>
      {Array.from({ length: 12 }).map((_, gridIndex) => (
        <div className={classes.logoGridItem} key={gridIndex}>
          {logoPositions
            .filter(item => item.position === gridIndex)
            .map(logo => (
              <div
                key={logo.id}
                style={{ opacity: logo.isVisible ? 1 : 0, transition: 'opacity 1s ease' }}
              >
                <Media resource={logo.logo} />
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
