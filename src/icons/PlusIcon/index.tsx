import * as React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const PlusIcon: React.FC<IconProps> = (props) => {
  const { bold, className, color, rotation, size } = props

  return (
    <svg
      className={[
        classes.icon,
        color && classes[color],
        size && classes[size],
        className,
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="100%"
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.stroke} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
