import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const ArrowRightIcon: React.FC<IconProps> = (props) => {
  const { bold, className, size } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="100%"
      viewBox="0 0 13 13"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.72028 1.43542L12 6.71516L6.72044 11.9947" stroke="currentColor" />
      <path d="M5.6173e-05 6.71424L11.9993 6.71442" stroke="currentColor" />
    </svg>
  )
}
