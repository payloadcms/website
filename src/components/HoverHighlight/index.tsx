'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import classes from './index.module.scss'

interface Props {
  children: React.ReactNode
  highlight?: boolean
}

const HoverHighlight: React.FC<Props> = ({ children, highlight = false }) => {
  const containerRef = useRef<HTMLSpanElement>(null)

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })

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

    if (containerRef.current) {
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
      intersectionObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMovement)
    }
  }, [containerRef])

  const getBackgroundOrigin = useMemo(() => {
    return `calc(${mousePosition.x}px - 100vw) calc(${mousePosition.y}px - 100vh)`
  }, [mousePosition])

  return (
    <span
      style={{ backgroundPosition: getBackgroundOrigin }}
      className={[classes.container, highlight && classes.highlight].filter(Boolean).join(' ')}
      ref={containerRef}
    >
      {children}
    </span>
  )
}

export default HoverHighlight
