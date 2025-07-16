import React from 'react'

import classes from './index.module.scss'

type GridLineStyles = {
  [index: number]: React.CSSProperties
}

type Props = {
  className?: string
  gridLineStyles?: GridLineStyles
  ignoreGutter?: boolean
  style?: React.CSSProperties
  wideGrid?: boolean
  zIndex?: number
}

export const BackgroundGrid: React.FC<Props> = ({
  className,
  gridLineStyles = {},
  ignoreGutter,
  style,
  wideGrid = false,
  zIndex = -1,
}: Props) => {
  return (
    <div
      aria-hidden="true"
      className={[
        classes.backgroundGrid,
        'grid',
        'background-grid',
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
          className={[classes.column, 'cols-4'].join(' ')}
          key={index}
          style={gridLineStyles[index] || {}}
        ></div>
      ))}
    </div>
  )
}
