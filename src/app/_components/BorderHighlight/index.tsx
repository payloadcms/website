import React from 'react'

import classes from './index.module.scss'

export const BorderHighlight: React.FC<{
  children: React.ReactNode
  borderHighlight?: boolean
  highlightColor: 'default' | 'success'
  className?: string
}> = ({ children, className, borderHighlight: borderHighlight, highlightColor }) => {
  return (
    <div
      data-background-container
      className={[classes.backgroundContainer, className].filter(Boolean).join(' ')}
    >
      {borderHighlight && (
        <div
          data-border-highlight
          className={[classes.borderHighlight, highlightColor === 'success' && classes.successColor]
            .filter(Boolean)
            .join(' ')}
        />
      )}
      <div data-container-content className={classes.containerContent}>
        {children}
      </div>
    </div>
  )
}
