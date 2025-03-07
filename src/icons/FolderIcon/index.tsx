import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const FolderIcon: React.FC<IconProps> = (props) => {
  const { bold, className, rotation, size } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      height="100%"
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={classes.fill}
        d="M11 5h13v17h-24v-20h8l3 3zm-10-2v18h22v-15h-12.414l-3-3h-6.586z"
      />
    </svg>
  )
}
