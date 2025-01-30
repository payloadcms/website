'use client'

import React from 'react'

import classes from './index.module.scss'

export const LineDraw: React.FC<{
  active?: boolean | null
  align?: 'bottom' | 'top'
  className?: string
  disabled?: boolean | null
}> = ({ active: isHovered, align = 'top', className, disabled }) => {
  return (
    <div
      className={[
        classes.lineDraw,
        className,
        !disabled && isHovered && classes.isHovered,
        align && classes[align],
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
