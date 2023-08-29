import * as React from 'react'

import classes from './index.module.scss'

export const Pill: React.FC<{
  className?: string
  text: string
  color?: 'default' | 'success' | 'error' | 'warning' | 'blue'
}> = ({ className, text, color }) => {
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
