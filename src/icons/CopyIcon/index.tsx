import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const CopyIcon: React.FC<IconProps> = props => {
  const { size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 13 13"
      xmlns="http://www.w3.org/2000/svg"
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
    >
      <path d="M0.5 4.5H8.5V12.5H0.5V4.5Z" className={classes.stroke} />
      <path d="M4.5 3V0.5H12.5V8.5H10" className={classes.stroke} />
    </svg>
  )
}
