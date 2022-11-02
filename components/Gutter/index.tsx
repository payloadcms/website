import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  left?: 'none' | 'half' | 'full'
  right?: 'none' | 'half' | 'full'
  disableMobile?: boolean
}
export const Gutter: React.FC<Props> = ({
  children,
  className,
  left = 'full',
  right = 'full',
  disableMobile,
}) => {
  return (
    <div
      className={[
        classes[`left--${left}`],
        classes[`right--${right}`],
        className,
        disableMobile && classes.disableMobile,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
