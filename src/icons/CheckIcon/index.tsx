import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const CheckIcon: React.FC<IconProps> = props => {
  const { color, size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 14 11"
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
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.stroke} d="M2.24023 5.72L5.04023 9.08L12.3202 1.8" />
    </svg>
  )
}
