import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const CopyIcon: React.FC<IconProps> = (props) => {
  const { bold, className, size } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      height="100%"
      viewBox="0 0 13 13"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.stroke} d="M0.5 4.5H8.5V12.5H0.5V4.5Z" />
      <path className={classes.stroke} d="M4.5 3V0.5H12.5V8.5H10" />
    </svg>
  )
}
