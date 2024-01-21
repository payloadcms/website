import React from 'react'

import classes from './index.module.scss'

interface Props {
  /**
   * Adds top and bottom borders to the scanline
   */
  enableBorders?: boolean
  className?: string
}
export const BackgroundScanline: React.FC<Props> = ({ className, enableBorders }: Props) => {
  return (
    <div
      className={[classes.backgroundScanline, className, enableBorders && classes.enableBorders]
        .filter(Boolean)
        .join(' ')}
    ></div>
  )
}
