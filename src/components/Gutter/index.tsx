import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  dataTheme?: string
  disableMobile?: boolean
  leftGutter?: boolean
  ref?: React.MutableRefObject<any>
  rightGutter?: boolean
}
export const Gutter: React.FC<Props> = ({
  children,
  className,
  dataTheme,
  disableMobile,
  leftGutter = true,
  ref: refFromProps,
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
      data-theme={dataTheme}
      ref={refFromProps || null}
    >
      {children}
    </div>
  )
}
