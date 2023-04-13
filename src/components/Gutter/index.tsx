import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  disableMobile?: boolean
  leftGutter?: boolean
  rightGutter?: boolean
}
export const Gutter: React.FC<Props> = ({
  children,
  className,
  disableMobile,
  leftGutter = true,
  rightGutter = true,
}) => {
  return (
    <div
      className={[
        className,
        leftGutter && classes.leftGutter,
        rightGutter && classes.rightGutter,
        disableMobile && classes.disableMobile,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
