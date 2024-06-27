import React from 'react'

import classes from './index.module.scss'

export const ExtendedBackground: React.FC<{
  upperChildren: React.ReactNode
  lowerChildren?: React.ReactNode
  borderHighlight?: boolean
  pixels?: boolean
  className?: string
}> = ({ lowerChildren, upperChildren, pixels, className, borderHighlight: borderHighlight }) => {
  return (
    <div
      className={[classes.container, pixels && classes.withPixels, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div data-component="top-container" className={classes.backgroundContainer}>
        {borderHighlight && <div className={classes.borderHighlight} />}
        <div className={classes.containerContent}>{upperChildren}</div>
      </div>

      {lowerChildren && (
        <div data-component="bottom-container" className={classes.backgroundContainer}>
          <div className={`${classes.containerContent} ${classes.lowerBackground}`}>
            {lowerChildren}
          </div>
        </div>
      )}

      {pixels && <div data-component="pixels" className={classes.pixelBackground} />}
    </div>
  )
}
