import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const CodeIcon: React.FC<IconProps> = (props) => {
  const { className, size } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size]].filter(Boolean).join(' ')}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  )
}
