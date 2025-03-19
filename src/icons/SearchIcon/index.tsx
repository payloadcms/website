import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const SearchIcon: React.FC<IconProps> = (props) => {
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
      viewBox="0 0 15 16"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className={classes.stroke} cx="6.20691" cy="6.96344" r="5" />
      <path className={classes.stroke} d="M10.2069 10.9634L13.7069 14.4634" />
    </svg>
  )
}
