import React from 'react'

import classes from './index.module.scss'

type Props = {
  bottom?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  top?: boolean
}

export const BlockSpacing: React.FC<Props> = ({
  bottom = true,
  children,
  className,
  style,
  top = true,
}) => {
  return (
    <div
      className={[className, top && classes.top, bottom && classes.bottom]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}
