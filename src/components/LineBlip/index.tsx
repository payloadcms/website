'use client'

import React, { useEffect, useRef, useState } from 'react'
import classes from './index.module.scss'

export const LineBlip: React.FC<{
  className?: string
  active?: Boolean
  align?: 'top' | 'bottom'
  blipGapSize?: 'small' | 'large'
}> = ({ className, active: isHovered, align = 'top', blipGapSize }) => {
  const [isAnimating, setIsAnimating] = useState(isHovered)
  const [isAnimatingIn, setIsAnimatingIn] = useState<boolean>(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  let animationDuration = 750

  if (blipGapSize === 'large') {
    animationDuration = 1000
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let outTimer: NodeJS.Timeout | undefined = undefined // eslint-disable-line
    let inTimer: NodeJS.Timeout | undefined = undefined // eslint-disable-line

    if (isHovered) {
      if (ref?.current) {
        ref.current.style.animationDuration = '0'
      }
      setIsAnimating(true)
      setIsAnimatingIn(true)

      if (inTimer) clearTimeout(inTimer)

      inTimer = setTimeout(() => {
        setIsAnimating(false)
        setIsAnimatingIn(false)
      }, animationDuration)

      setIsAnimatingOut(false)
    } else {
      setIsAnimating(true)
      setIsAnimatingIn(false)
      setIsAnimatingOut(true)

      if (outTimer) clearTimeout(outTimer)

      outTimer = setTimeout(() => {
        setIsAnimating(false)
        setIsAnimatingOut(false)
      }, animationDuration)
    }
    return () => {
      if (inTimer) {
        clearTimeout(inTimer)
      }

      if (outTimer) {
        clearTimeout(outTimer)
      }
    }
  }, [isHovered])

  return (
    <div
      ref={ref}
      className={[
        classes.lineBlip,
        className,
        isHovered && classes.isHovered,
        isAnimatingIn && classes.isAnimatingIn,
        isAnimatingOut && classes.animatingOut,
        isAnimating && classes.isAnimating,
        align && classes[align],
        blipGapSize && classes[`gap-${blipGapSize}`],
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        // @ts-ignore-line
        '--duration': `${animationDuration}ms`,
      }}
    />
  )
}
