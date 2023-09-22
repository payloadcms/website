import React from 'react'

import classes from './index.module.scss'

export const BorderHighlight: React.FC<{
  children: React.ReactNode
  borderHighlight?: boolean
  className?: string
}> = ({ children, className, borderHighlight: borderHighlight }) => {
  return (
    <div className={[classes.container, className].filter(Boolean).join(' ')}>
      <div className={classes.backgroundContainer}>
        {borderHighlight && <div className={classes.borderHighlight} />}
        <div className={classes.containerContent}>{children}</div>
      </div>
    </div>
  )
}
