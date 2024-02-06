import React from 'react'

import classes from './index.module.scss'

interface Props {
  className?: string
  ignoreGutter?: boolean
  zIndex?: number
}
export const BackgroundGrid: React.FC<Props> = ({
  className,
  ignoreGutter,
  zIndex = -1,
}: Props) => {
  return (
    <div
      aria-hidden={true}
      className={[classes.backgroundGrid, 'grid', ignoreGutter && classes.ignoreGutter, className]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex: zIndex }}
    >
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
    </div>
  )
}
