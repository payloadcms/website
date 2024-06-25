import * as React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const PlusIcon: React.FC<IconProps> = props => {
  const { color, size, className, bold, rotation } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
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
      <path d="M12 4.5v15m7.5-7.5h-15" className={classes.stroke} />
    </svg>
  )
}
