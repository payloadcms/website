'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import classes from './index.module.scss'

export const UniversalTruth = () => {
  const universalTruth = useSearchParams().get('universaltruth') === 'pls'
  const cursorRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent) => {
    const cursor = cursorRef.current
    if (cursor) {
      cursor.style.top = e.clientY + 10 + 'px'
      cursor.style.left = e.clientX + 10 + 'px'
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return universalTruth ? <div className={classes.cursor} ref={cursorRef} /> : null
}
