import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  padding?: 'large'
}
export const BorderBox: React.FC<Props> = ({ children, className, padding }) => {
  return (
    <div
      className={[className, classes.borderBox, padding && classes[`padding--${padding}`]]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
