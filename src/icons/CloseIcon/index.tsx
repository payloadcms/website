import React from 'react'

import { IconProps } from '../types'

import classes from '../index.module.scss'

export const CloseIcon: React.FC<IconProps> = props => {
  const { color, size, className, bold, rotation } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
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
      <line className={classes.stroke} x1="2" y1="2" x2="13" y2="13" />
      <line className={classes.stroke} x1="13" y1="2" x2="2" y2="13" />
    </svg>
  )
}
