'use client'
import { useThemePreference } from '@root/providers/Theme/index'
import React from 'react'

import classes from './index.module.scss'

const LightDarkImage: (props: {
  alt: string
  caption?: string
  srcDark: string
  srcLight: string
}) => React.JSX.Element = ({ alt, caption, srcDark, srcLight }) => {
  const { theme } = useThemePreference()
  const src = theme === 'dark' ? srcDark : srcLight

  return (
    <div className={classes.imageWrap}>
      <img alt={alt} src={src} />
      {caption && <div className={classes.caption}>{caption}</div>}
    </div>
  )
}

export default LightDarkImage
