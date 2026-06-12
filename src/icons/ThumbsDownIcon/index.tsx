import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const ThumbsDownIcon: React.FC<IconProps> = (props) => {
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
        d="M23 3h-4v12h4V3zM1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2H6c-.83 0-1.54.5-1.84 1.22L1.14 11.27c-.09.23-.14.47-.14.73v2z"
        fill="currentColor"
      />
    </svg>
  )
}
