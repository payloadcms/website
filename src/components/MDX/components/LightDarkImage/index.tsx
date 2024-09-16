'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'

import { useThemePreference } from '@root/providers/Theme/index.js'

import classes from './index.module.scss'

const LightDarkImage: (props: {
  srcLight: string
  srcDark: string
  alt: string
  caption?: string
}) => React.JSX.Element = ({ srcLight, srcDark, alt, caption }) => {
  const { theme } = useThemePreference()
  const src = theme === 'dark' ? srcDark : srcLight

  return (
    <div className={classes.imageWrap}>
      <img src={src} alt={alt} />
      {caption && <div className={classes.caption}>{caption}</div>}
    </div>
  )
}

export default LightDarkImage
