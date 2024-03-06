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
  wideGrid?: boolean
}

export const BackgroundGrid: React.FC<Props> = ({
  className,
  ignoreGutter,
  style,
  zIndex = -1,
  gridLineStyles = {},
  wideGrid = false,
}: Props) => {
  return (
    <div
      aria-hidden="true"
      className={[
        classes.backgroundGrid,
        'grid',
        ignoreGutter && classes.ignoreGutter,
        className,
        wideGrid && classes.wideGrid,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, zIndex }}
    >
      {[...Array(wideGrid ? 4 : 5)].map((_, index) => (
        <div
          key={index}
          className={[classes.column, 'cols-4'].join(' ')}
          style={gridLineStyles[index] || {}}
        ></div>
      ))}
    </div>
  )
}
