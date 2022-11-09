import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  disableMobile?: boolean
}
export const Gutter: React.FC<Props> = ({ children, className, disableMobile }) => {
  return (
    <div
      className={[className, classes.gutter, disableMobile && classes.disableMobile]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
