import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const ErrorIcon: React.FC<IconProps> = (props) => {
  const { bold, className, rotation, size } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="100%"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      viewBox="0 0 4 13"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.fill} d="M3.5 0H0.5L1.5 8H2.5L3.5 0Z" />
      <path
        className={classes.fill}
        d="M0.75 11C0.75 11.69 1.31 12.25 2 12.25C2.69 12.25 3.25 11.69 3.25 11C3.25 10.31 2.69 9.75 2 9.75C1.31 9.75 0.75 10.31 0.75 11Z"
      />
    </svg>
  )
}
