import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const PlayIcon: React.FC<IconProps> = props => {
  const { color, rotation, size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 23 25"
      xmlns="http://www.w3.org/2000/svg"
      className={[
        className,
        classes.icon,
        color && classes[color],
        size && classes[size],
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <path d="M0.470703 25V0L22.5293 12.8676L0.470703 25Z" fill="white" fillOpacity="0.75" />
    </svg>
  )
}
