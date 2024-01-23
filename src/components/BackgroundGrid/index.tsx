import React from 'react'

import classes from './index.module.scss'

interface Props {
  className?: string
  ignoreGutter?: boolean
}
export const BackgroundGrid: React.FC<Props> = ({ className, ignoreGutter }: Props) => {
  return (
    <div
      aria-hidden={true}
      className={[classes.backgroundGrid, 'grid', ignoreGutter && classes.ignoreGutter, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
    </div>
  )
}
