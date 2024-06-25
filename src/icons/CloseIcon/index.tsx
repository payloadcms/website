import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const CloseIcon: React.FC<IconProps> = props => {
  const { color, size, className, bold, rotation } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      className={[
        classes.icon,
        color && classes[color],
        size && classes[size],
        className,
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    >
      <g clipPath="url(#clip0_4622_426)">
        <line x1="0.646447" y1="28.9316" x2="28.9307" y2="0.647332" stroke="currentColor" />
        <line x1="1.35355" y1="0.931603" x2="29.6378" y2="29.2159" stroke="currentColor" />
      </g>
    </svg>
  )
}
;``
