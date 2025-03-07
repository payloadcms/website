import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const BranchIcon: React.FC<IconProps> = (props) => {
  const { bold, className, color, size } = props

  return (
    <svg
      className={[
        className,
        classes.icon,
        color && classes[color],
        size && classes[size],
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      fill="none"
      height="100%"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={classes.stroke}
        d="M6.5 6C7.88071 6 9 4.88071 9 3.5C9 2.11929 7.88071 1 6.5 1C5.11929 1 4 2.11929 4 3.5C4 4.88071 5.11929 6 6.5 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={classes.stroke}
        d="M6.5 23C7.88071 23 9 21.8807 9 20.5C9 19.1193 7.88071 18 6.5 18C5.11929 18 4 19.1193 4 20.5C4 21.8807 5.11929 23 6.5 23Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path className={classes.stroke} d="M6 18V6" strokeLinecap="round" strokeLinejoin="round" />
      <path
        className={classes.stroke}
        d="M16.5 10C17.8807 10 19 8.88071 19 7.5C19 6.11929 17.8807 5 16.5 5C15.1193 5 14 6.11929 14 7.5C14 8.88071 15.1193 10 16.5 10Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className={classes.stroke}
        d="M16 10C16 16.4 6 12.4 6 18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
