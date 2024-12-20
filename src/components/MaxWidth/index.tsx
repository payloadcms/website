import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  centered?: boolean
  children: React.ReactNode
  className?: string
  size?: 'large' | 'medium' | 'small'
}
export const MaxWidth: React.FC<Props> = ({ centered, children, className, size = 'large' }) => {
  return (
    <div
      className={[className, classes.maxWidth, size && classes[size], centered && classes.centered]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
