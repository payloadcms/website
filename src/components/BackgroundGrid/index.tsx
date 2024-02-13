import React from 'react'

import classes from './index.module.scss'

type GridLineStyles = {
  [index: number]: React.CSSProperties
}

type Props = {
  className?: string
  ignoreGutter?: boolean
  style?: React.CSSProperties
  zIndex?: number
  gridLineStyles?: GridLineStyles
}

export const BackgroundGrid: React.FC<Props> = ({
  className,
  ignoreGutter,
  style,
  zIndex = -1,
  gridLineStyles = {},
}: Props) => {
  return (
    <div
      aria-hidden="true"
      className={[classes.backgroundGrid, 'grid', ignoreGutter && classes.ignoreGutter, className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, zIndex }}
    >
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={[classes.column, 'cols-4'].join(' ')}
          style={gridLineStyles[index] || {}}
        ></div>
      ))}
    </div>
  )
}
