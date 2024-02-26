'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { AllowedElements } from '@components/SpotlightAnimation/types'
import { useResize } from '@root/utilities/use-resize'

import classes from './index.module.scss'

interface Props {
  children: React.ReactNode
  as?: AllowedElements
  /**
   * Gets an array from rich text which it can loop through and get a string text
   * Required for SplitAnimate to work
   */
  richTextChildren?: any[]
}

const SpotlightAnimation: React.FC<Props> = ({ children, richTextChildren, as = 'h2' }) => {
  const containerRef = useRef<HTMLElement>(null)
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

    const handleWindowResize = e => {
      if (scheduledAnimationFrame) {
        return
      }

      scheduledAnimationFrame = true
      requestAnimationFrame(function () {
        resetPosition()
      })
    }

    const updateMousePosition = e => {
      if (containerRef.current) {
        const boundingRect = containerRef.current.getBoundingClientRect()

        setMousePosition({
          x: e.clientX - boundingRect.left,
          y: e.clientY - boundingRect.top,
        })
      }
      scheduledAnimationFrame = false
    }

    const handleMouseMovement = e => {
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
        entries => {
          entries.forEach(entry => {
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
      if (intersectionObserver) intersectionObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMovement)
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [containerRef, containerSize])

  const getBackgroundOrigin = useMemo(() => {
    return `calc(${mousePosition.x}px - 100vw) calc(${mousePosition.y}px - 100vh)`
  }, [mousePosition])

  return (
    <div className={[classes.wrapper].filter(Boolean).join(' ')}>
      <Element
        style={{ backgroundPosition: getBackgroundOrigin }}
        className={[classes.container].filter(Boolean).join(' ')}
        // @ts-expect-error
        ref={containerRef}
      >
        {children}
      </Element>
    </div>
  )
}

export default SpotlightAnimation
