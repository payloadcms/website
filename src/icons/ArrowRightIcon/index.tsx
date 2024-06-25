import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const ArrowRightIcon: React.FC<IconProps> = props => {
  const { size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
    >
      <path d="M6.72028 1.43542L12 6.71516L6.72044 11.9947" stroke="white" />
      <path d="M5.6173e-05 6.71424L11.9993 6.71442" stroke="white" />
    </svg>
  )
}
