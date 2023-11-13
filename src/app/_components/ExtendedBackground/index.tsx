import React from 'react'

import { BorderHighlight } from '../BorderHighlight'

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
      className={[classes.extendedBackgroundWrap, pixels && classes.withPixels, className]
        .filter(Boolean)
        .join(' ')}
    >
      <BorderHighlight
        data-component="top-container"
        borderHighlight={borderHighlight}
        highlightColor="success"
      >
        {upperChildren}
      </BorderHighlight>

      {lowerChildren && (
        <BorderHighlight
          data-component="bottom-container"
          borderHighlight={false}
          highlightColor="default"
          className={classes.lowerBackground}
        >
          <div className={`${classes.containerContent} ${classes.lowerBackground}`}>
            {lowerChildren}
          </div>
        </BorderHighlight>
      )}

      {pixels && <div data-component="pixels" className={classes.pixelBackground} />}
    </div>
  )
}
