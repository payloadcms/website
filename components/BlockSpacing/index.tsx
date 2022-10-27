import React from 'react'
import classes from './index.module.scss'

type Props = {
  top?: boolean
  bottom?: boolean
  children: React.ReactNode
  className?: string
}

export const BlockSpacing: React.FC<Props> = ({
  top = true,
  bottom = true,
  className,
  children,
}) => {
  return (
    <div
      className={[className, top && classes.top, bottom && classes.bottom]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
