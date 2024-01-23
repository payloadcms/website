import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  disableMobile?: boolean
  leftGutter?: boolean
  rightGutter?: boolean
  ref?: React.MutableRefObject<any>
}
export const Gutter: React.FC<Props> = ({
  children,
  className,
  disableMobile,
  leftGutter = true,
  rightGutter = true,
  ref: refFromProps,
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
      ref={refFromProps || null}
    >
      {children}
    </div>
  )
}
