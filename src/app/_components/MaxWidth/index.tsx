import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  size?: 'small' | 'medium' | 'large'
  centered?: boolean
}
export const MaxWidth: React.FC<Props> = ({ children, className, size = 'large', centered }) => {
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
