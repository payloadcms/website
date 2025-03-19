import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import React from 'react'

import classes from './index.module.scss'

const crosshairPositions = ['top-left', 'bottom-left', 'top-right', 'bottom-right'] as const

interface Props {
  className?: string
  crosshairs?: 'all' | (typeof crosshairPositions)[number][]
  /**
   * Adds top and bottom borders to the scanline
   */
  enableBorders?: boolean
  style?: React.CSSProperties
}
export const BackgroundScanline: React.FC<Props> = ({
  className,
  crosshairs,
  enableBorders,
  style,
}: Props) => {
  return (
    <div
      aria-hidden="true"
      className={[classes.wrapper, className, enableBorders && classes.enableBorders]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className={[classes.backgroundScanline].filter(Boolean).join(' ')}></div>
      {crosshairs && (
        <>
          {(crosshairs === 'all' || crosshairs.includes('top-left')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairTopLeft, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {(crosshairs === 'all' || crosshairs.includes('bottom-left')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairBottomLeft, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {(crosshairs === 'all' || crosshairs.includes('top-right')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairTopRight, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {(crosshairs === 'all' || crosshairs.includes('bottom-right')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairBottomRight, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}
        </>
      )}
    </div>
  )
}
