import React from 'react'

import { IconProps } from '../types'

import classes from '../index.module.scss'

export const CloseIcon: React.FC<IconProps> = props => {
  const { color, size, className, bold, rotation } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 18 17"
      xmlns="http://www.w3.org/2000/svg"
      className={[
        classes.icon,
        color && classes[color],
        size && classes[size],
        className,
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    >
      <path
        className={classes.stroke}
        d="M1.94727 15.6296L15.7834 1.79346M2.53803 1.79347L16.3742 15.6296"
      />
    </svg>
  )
}
