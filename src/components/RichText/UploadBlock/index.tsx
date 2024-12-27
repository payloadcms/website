'use client'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import React from 'react'

import { RichText } from '..'
import classes from './index.module.scss'

export const UploadBlockImage: (props: {
  alt?: string
  caption?: any
  src: string
}) => React.JSX.Element = ({ alt, caption, src }) => {
  return (
    <div className={classes.imageWrap}>
      <img alt={alt} src={src} />
      {caption && hasText(caption) ? (
        <div className={classes.caption}>
          <RichText content={caption} />
        </div>
      ) : null}
    </div>
  )
}
