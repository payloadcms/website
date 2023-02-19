import React from 'react'

import classes from './index.module.scss'

export const ExtendedBackground: React.FC<{
  children: React.ReactNode
  size?: 's' | 'l'
  className?: string
}> = ({ children, size = 's', className }) => {
  return (
    <div className={[classes.container, className].filter(Boolean).join(' ')}>
      {children}
      <div
        data-component="extension"
        className={[classes.extendedBackground, classes[`size--${size}`]].filter(Boolean).join(' ')}
      />
    </div>
  )
}
