import React from 'react'

import classes from './index.module.scss'

interface Props {
  className?: string
}
export const BackgroundScanline: React.FC<Props> = ({ className }: Props) => {
  return <div className={[classes.backgroundScanline, className].filter(Boolean).join(' ')}></div>
}
