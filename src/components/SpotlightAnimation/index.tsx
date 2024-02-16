'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import SplitAnimate from '@components/SplitAnimate'
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
  const [ready, setReady] = useState(false)
  const containerSize = useResize(containerRef)

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })

  const Element = as
  const hasFadeIn = ['h1', 'h2', 'h3'].includes(as)

  const contentsAsString = useMemo(() => {
    if (!richTextChildren) return null
    const items = richTextChildren.map(node => {
      return node.text
    })

    return items.join('')
  }, [richTextChildren])

  useEffect(() => {
    let intersectionObserver: IntersectionObserver
    let scheduledAnimationFrame = false

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

    const canAnimate = hasFadeIn ? ready : true

    if (containerRef.current && canAnimate) {
      intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              window.addEventListener('mousemove', handleMouseMovement)
            } else {
              window.removeEventListener('mousemove', handleMouseMovement)
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
    }
  }, [containerRef, ready, hasFadeIn, containerSize])

  const getBackgroundOrigin = useMemo(() => {
    return `calc(${mousePosition.x}px - 100vw) calc(${mousePosition.y}px - 100vh)`
  }, [mousePosition])

  const handlePostAnimation = () => {
    setReady(true)
  }

  return (
    <div className={[classes.wrapper].filter(Boolean).join(' ')}>
      <Element
        style={{ backgroundPosition: getBackgroundOrigin }}
        className={[classes.container, hasFadeIn && classes.hasFadeIn, ready && classes.ready]
          .filter(Boolean)
          .join(' ')}
        // @ts-expect-error
        ref={containerRef}
      >
        {children}
      </Element>
      {contentsAsString && hasFadeIn && (
        <SplitAnimate
          callback={handlePostAnimation}
          className={[classes.splitAnimate, ready && classes.ready].filter(Boolean).join(' ')}
          as={as}
          aria-hidden={true}
          // inert needs to be destructured due to React type errors
          {...{ inert: '' }}
          text={contentsAsString}
        />
      )}
    </div>
  )
}

export default SpotlightAnimation
