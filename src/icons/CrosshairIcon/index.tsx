import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const CrosshairIcon: React.FC<IconProps> = props => {
  const { rotation, size = 'large', className, bold } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      stroke="currentColor"
    >
      <path d="M10 0.332031V20.332" />
      <path d="M0 10.332L20 10.332" />
    </svg>
  )
}
