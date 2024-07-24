import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const FolderIcon: React.FC<IconProps> = props => {
  const { rotation, size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <path
        d="M11 5h13v17h-24v-20h8l3 3zm-10-2v18h22v-15h-12.414l-3-3h-6.586z"
        className={classes.fill}
      />
    </svg>
  )
}
