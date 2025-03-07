import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const CrosshairIcon: React.FC<IconProps> = (props) => {
  const { bold, className, rotation, size = 'large' } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="21"
      stroke="currentColor"
      viewBox="0 0 20 21"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 0.332031V20.332" />
      <path d="M0 10.332L20 10.332" />
    </svg>
  )
}
