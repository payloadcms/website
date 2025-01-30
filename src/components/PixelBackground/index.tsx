import * as React from 'react'

import classes from './index.module.scss'

export const PixelBackground: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  return <div className={[classes.pixelBackground, className].filter(Boolean).join(' ')} />
}
