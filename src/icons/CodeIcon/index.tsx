import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const CodeIcon: React.FC<IconProps> = props => {
  const { size, className } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={[className, classes.icon, size && classes[size]].filter(Boolean).join(' ')}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )
}
