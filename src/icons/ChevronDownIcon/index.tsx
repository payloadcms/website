import * as React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const ChevronDownIcon: React.FC<IconProps> = (props) => {
  const { bold, className, rotation, size } = props
  return (
    <svg
      className={[
        className,
        classes.icon,
        size && classes[size],
        bold && classes.bold,
        classes.chevronDown,
      ]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="100%"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      viewBox="0 0 22 12"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.stroke} d="M1 1.12109L11 11.1211L21 1.12109" />
    </svg>
  )
}
