import * as React from 'react'

import classes from './index.module.scss'

export const Pill: React.FC<{ className?: string; text: string }> = ({ className, text }) => {
  return (
    <div className={[classes.pill, className].filter(Boolean).join(' ')}>
      <span className={classes.text}>{text}</span>
    </div>
  )
}
