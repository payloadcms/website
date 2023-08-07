import React from 'react'

import classes from './index.module.scss'

// const icons = {
//   error: () => <div>!</div>,
//   success: CheckmarkIcon,
//   warning: () => <div>!</div>,
// }

export const Message: React.FC<{
  message?: React.ReactNode
  success?: React.ReactNode
  error?: React.ReactNode
  warning?: React.ReactNode
  className?: string
  margin?: boolean
}> = ({ error, success, warning, message, className, margin }) => {
  // const type = error ? 'error' : success ? 'success' : 'warning'
  // const Icon = icons[type]

  const label = error || success || warning || message

  if (label) {
    return (
      <div
        className={[
          classes.message,
          error && classes.error,
          success && classes.success,
          warning && classes.warning,
          className,
          margin === false && classes.noMargin,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* {Icon && (
          <div className={classes.icon}>
            <Icon />
          </div>
        )} */}
        <p className={classes.label}>{label}</p>
      </div>
    )
  }
  return null
}
