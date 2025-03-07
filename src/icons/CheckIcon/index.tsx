import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const CheckIcon: React.FC<IconProps> = (props) => {
  const { bold, className, color, size } = props

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
      fill="none"
      height="100%"
      viewBox="0 0 14 11"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.stroke} d="M2.24023 5.72L5.04023 9.08L12.3202 1.8" />
    </svg>
  )
}
