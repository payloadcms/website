import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const ArrowIcon: React.FC<IconProps> = (props) => {
  const { bold, className, rotation, size } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      height="100%"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      viewBox="0 0 13 13"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.stroke} d="M1 12L12.5 0.499965" />
      <path className={classes.stroke} d="M1 0.5H12.5V12" />
    </svg>
  )
}
