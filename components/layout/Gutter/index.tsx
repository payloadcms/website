import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  left?: 'none' | 'half' | 'full'
  right?: 'none' | 'half' | 'full'
}
export const Gutter: React.FC<Props> = ({ children, className, left = 'full', right = 'full' }) => {
  return (
    <div className={className}>
      <div className={[classes[`left--${left}`], classes[`right--${right}`], className].filter(Boolean).join(' ')}>{children}</div>
    </div>
  )
}
