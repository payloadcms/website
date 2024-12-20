'use client'
import type { CSSProperties } from 'react'

import React, { useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

interface Payload3DProps {}

const Payload3D: React.FC<Payload3DProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const defaultStyles = {
    '--mouse-x': 0,
    '--mouse-y': 0,
  } as CSSProperties
  const [gradientStyles, setGradientStyle] = useState<CSSProperties>(defaultStyles)

  useEffect(() => {
    let intersectionObserver: IntersectionObserver
    let scheduledAnimationFrame = false

    const updateMousePosition = (e) => {
      if (containerRef.current) {
        const boundingRect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - boundingRect.left
        const y = e.clientY - boundingRect.top

        const styles = {
          '--mouse-x': x,
          '--mouse-y': y,
        } as CSSProperties

        setGradientStyle(styles)
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
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
      window.removeEventListener('mousemove', handleMouseMovement)
    }
  }, [containerRef])

  return (
    <div className={classes.container} data-theme="dark" ref={containerRef}>
      <div className={classes.mask}>
        <div className={classes.noise} />
        <div className={classes.gradient} style={gradientStyles} />
      </div>
    </div>
  )
}

export default Payload3D
