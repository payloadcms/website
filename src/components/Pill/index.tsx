import * as React from 'react'

import classes from './index.module.scss'

export const Pill: React.FC<{
  className?: string
  color?: 'blue' | 'default' | 'error' | 'success' | 'warning'
  text: string
}> = ({ className, color, text }) => {
  return (
    <div
      className={[classes.pill, className, color && classes[`color--${color}`]]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={classes.text}>{text}</span>
    </div>
  )
}
