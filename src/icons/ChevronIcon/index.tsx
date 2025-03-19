import * as React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const ChevronIcon: React.FC<IconProps> = (props) => {
  const { bold, className, rotation, size } = props
  return (
    <svg
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="100%"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      viewBox="0 0 14 27"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className={classes.stroke} d="M1.40625 0.738037L14.1682 13.4999L1.40625 26.2618" />
    </svg>
  )
}
