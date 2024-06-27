import React from 'react'

import classes from './index.module.scss'

export const HR: React.FC<{
  className?: string
  margin?: 'small'
}> = ({ className, margin }) => {
  return (
    <hr
      className={[classes.hr, className, margin && classes[`margin--${margin}`]]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
