import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const CloseIcon: React.FC<IconProps> = (props) => {
  const { bold, className, color, rotation, size } = props

  return (
    <svg
      className={[
        classes.icon,
        color && classes[color],
        size && classes[size],
        className,
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="30"
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      viewBox="0 0 30 30"
      width="30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4622_426)">
        <line stroke="currentColor" x1="0.646447" x2="28.9307" y1="28.9316" y2="0.647332" />
        <line stroke="currentColor" x1="1.35355" x2="29.6378" y1="0.931603" y2="29.2159" />
      </g>
    </svg>
  )
}
;``
