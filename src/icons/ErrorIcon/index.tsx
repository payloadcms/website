import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const ErrorIcon: React.FC<IconProps> = props => {
  const { rotation, size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 4 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <path d="M3.5 0H0.5L1.5 8H2.5L3.5 0Z" className={classes.fill} />
      <path
        d="M0.75 11C0.75 11.69 1.31 12.25 2 12.25C2.69 12.25 3.25 11.69 3.25 11C3.25 10.31 2.69 9.75 2 9.75C1.31 9.75 0.75 10.31 0.75 11Z"
        className={classes.fill}
      />
    </svg>
  )
}
