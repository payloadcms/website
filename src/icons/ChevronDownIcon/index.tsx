import * as React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const ChevronDownIcon: React.FC<IconProps> = props => {
  const { rotation, size, className, bold } = props
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 22 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={[
        className,
        classes.icon,
        size && classes[size],
        bold && classes.bold,
        classes.chevronDown,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <path d="M1 1.12109L11 11.1211L21 1.12109" className={classes.stroke} />
    </svg>
  )
}
