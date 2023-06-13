/* eslint-disable @next/next/no-img-element */
import React from 'react'

import classes from './index.module.scss'

const LightDarkImage: React.FC<{
  srcLight: string
  srcDark: string
  alt: string
  caption?: string
}> = ({ srcLight, srcDark, alt, caption }) => (
  <div className={classes.imageWrap}>
    <img className={classes.imgLight} src={srcLight} alt={alt} />
    <img className={classes.imgDark} src={srcDark} alt={alt} />
    {caption && <div className={classes.caption}>{caption}</div>}
  </div>
)

export default LightDarkImage
