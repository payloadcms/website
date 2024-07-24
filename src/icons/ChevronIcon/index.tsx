import * as React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const ChevronIcon: React.FC<IconProps> = props => {
  const { rotation, size, className, bold } = props
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 14 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <path d="M1.40625 0.738037L14.1682 13.4999L1.40625 26.2618" className={classes.stroke} />
    </svg>
  )
}
