'use client'
import type { AllowedElements } from '@components/SpotlightAnimation/types'

import { useResize } from '@root/utilities/use-resize'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import classes from './index.module.scss'

interface Props {
  as?: AllowedElements
  children: React.ReactNode
  /**
   * Gets an array from rich text which it can loop through and get a string text
   * Required for SplitAnimate to work
   */
  richTextChildren?: any[]
}

const SpotlightAnimation: React.FC<Props> = ({ as = 'h2', children, richTextChildren }) => {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const containerSize = useResize(containerRef)

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })

  const Element = as

  useEffect(() => {
    let intersectionObserver: IntersectionObserver
    let scheduledAnimationFrame = false

    const resetPosition = () => {
      setMousePosition({
        x: 0,
        y: 0,
      })
    }

    const handleWindowResize = (e) => {
      if (scheduledAnimationFrame) {
        return
      }

      scheduledAnimationFrame = true
      requestAnimationFrame(function () {
        resetPosition()
      })
    }

    const updateMousePosition = (e) => {
      if (containerRef.current) {
        const boundingRect = containerRef.current.getBoundingClientRect()

        setMousePosition({
          x: e.clientX - boundingRect.left,
          y: e.clientY - boundingRect.top,
        })
      }
      scheduledAnimationFrame = false
    }

    const handleMouseMovement = (e) => {
      if (scheduledAnimationFrame) {
        return
      }

      scheduledAnimationFrame = true
      requestAnimationFrame(function (timestamp) {
        updateMousePosition(e)
      })
    }

    if (containerRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              window.addEventListener('mousemove', handleMouseMovement)
              window.addEventListener('resize', handleWindowResize)
            } else {
              window.removeEventListener('mousemove', handleMouseMovement)
              window.removeEventListener('resize', handleWindowResize)
            }
          })
        },
        {
          rootMargin: '0px',
        },
      )

      intersectionObserver.observe(containerRef.current)
    }

    return () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
      window.removeEventListener('mousemove', handleMouseMovement)
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [containerRef, containerSize])

  const getBackgroundOrigin = useMemo(() => {
    return `calc(${mousePosition.x}px - 100vw) calc(${mousePosition.y}px - 100vh)`
  }, [mousePosition])

  return (
    <div className={[classes.wrapper].filter(Boolean).join(' ')}>
      {/* @ts-expect-error */}
      <Element
        className={[classes.container].filter(Boolean).join(' ')}
        ref={containerRef}
        style={{ backgroundPosition: getBackgroundOrigin }}
      >
        {children}
      </Element>
    </div>
  )
}

export default SpotlightAnimation
