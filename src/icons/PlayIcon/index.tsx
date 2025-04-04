import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const PlayIcon: React.FC<IconProps> = (props) => {
  const { bold, className, color, rotation, size } = props

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
      height="100%"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      viewBox="0 0 20 20"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={classes.stroke}
        d="M17.3889 0.5H2.61111C1.44518 0.5 0.5 1.44518 0.5 2.61111V17.3889C0.5 18.5548 1.44518 19.5 2.61111 19.5H17.3889C18.5548 19.5 19.5 18.5548 19.5 17.3889V2.61111C19.5 1.44518 18.5548 0.5 17.3889 0.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={classes.stroke}
        d="M6.83333 5.77778L13.1667 10L6.83333 14.2222V5.77778Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
