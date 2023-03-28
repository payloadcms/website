'use client'

import React from 'react'
import classes from './index.module.scss'

export const LineDraw: React.FC<{
  className?: string
  active?: Boolean | null
  align?: 'top' | 'bottom'
}> = ({ className, active: isHovered, align = 'top' }) => {
  return (
    <div
      className={[
        classes.lineDraw,
        className,
        isHovered && classes.isHovered,
        align && classes[align],
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
