import React from 'react'

import classes from './index.module.scss'

export const ExtendedBackground: React.FC<{
  borderHighlight?: boolean
  className?: string
  lowerChildren?: React.ReactNode
  pixels?: boolean
  upperChildren: React.ReactNode
}> = ({ borderHighlight: borderHighlight, className, lowerChildren, pixels, upperChildren }) => {
  return (
    <div
      className={[classes.container, pixels && classes.withPixels, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.backgroundContainer} data-component="top-container">
        {borderHighlight && <div className={classes.borderHighlight} />}
        <div className={classes.containerContent}>{upperChildren}</div>
      </div>

      {lowerChildren && (
        <div className={classes.backgroundContainer} data-component="bottom-container">
          <div className={`${classes.containerContent} ${classes.lowerBackground}`}>
            {lowerChildren}
          </div>
        </div>
      )}

      {pixels && <div className={classes.pixelBackground} data-component="pixels" />}
    </div>
  )
}
