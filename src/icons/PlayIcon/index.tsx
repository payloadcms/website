import React from 'react'

import type { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const PlayIcon: React.FC<IconProps> = (props) => {
  const { bold, className, color, rotation, size } = props

  return (
    <svg
      className={[
        className,
        classes.icon,
        color && classes[color],
        size && classes[size],
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      height="100%"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      viewBox="0 0 23 25"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.470703 25V0L22.5293 12.8676L0.470703 25Z" fill="white" fillOpacity="0.75" />
    </svg>
  )
}
