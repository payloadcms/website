import React, { ElementType, forwardRef, Fragment } from 'react'

import { Image } from './Image/index.js'
import { Props } from './types.js'
import { Video } from './Video/index.js'

export const Media = forwardRef<HTMLDivElement | HTMLImageElement | HTMLVideoElement, Props>(
  (props, ref) => {
    const { className, resource, htmlElement = 'div' } = props

    const isVideo = typeof resource !== 'string' && resource?.mimeType?.includes('video')
    const Tag = (htmlElement as ElementType) || Fragment

    return (
      <Tag ref={ref} {...(htmlElement !== null ? { className } : {})}>
        {isVideo ? (
          <Video {...props} />
        ) : (
          <Image {...props} /> // eslint-disable-line
        )}
      </Tag>
    )
  },
)
