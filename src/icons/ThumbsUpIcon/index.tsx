import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const ThumbsUpIcon: React.FC<IconProps> = (props) => {
  const { className, size } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size]].filter(Boolean).join(' ')}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
        fill="currentColor"
      />
    </svg>
  )
}
