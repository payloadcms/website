'use client'

import React, { useEffect, useState } from 'react'
import classes from './index.module.scss'

const animationDuration = 500

export const LineBlip: React.FC<{
  className?: string
  active?: Boolean
  align?: 'top' | 'bottom'
  gapSize?: 'small' | 'large'
}> = ({ className, active, align = 'top', gapSize }) => {
  const [isHovered, setIsHovered] = useState(active)
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false)

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (active) {
      setIsHovered(true)
      setIsAnimatingOut(true)
    } else {
      setIsHovered(false)
      setIsAnimatingOut(true)
      let timerID: NodeJS.Timeout // eslint-disable-line

      if (timerID) clearTimeout(timerID)

      timerID = setTimeout(() => {
        setIsAnimatingOut(false)
      }, animationDuration)

      return () => {
        if (timerID) {
          clearTimeout(timerID)
        }
      }
    }
  }, [active])

  return (
    <div
      className={[
        classes.lineBlip,
        className,
        isAnimatingOut && classes.animatingOut,
        isHovered && classes.isHovered,
        align && classes[align],
        gapSize && classes[`gap-${gapSize}`],
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
