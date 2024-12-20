import type { ElementType} from 'react';

import React, { forwardRef, Fragment } from 'react'

import type { Props } from './types.js'

import { Image } from './Image/index.js'
import { Video } from './Video/index.js'

export const Media = forwardRef<HTMLDivElement | HTMLImageElement | HTMLVideoElement, Props>(
  (props, ref) => {
    const { className, htmlElement = 'div', resource } = props

    const isVideo = typeof resource !== 'string' && resource?.mimeType?.includes('video')
    const Tag = (htmlElement as ElementType) || Fragment

    return (
      <Tag ref={ref} {...(htmlElement !== null ? { className } : {})}>
        {isVideo ? (
          <Video {...props} />
        ) : (
          <Image {...props} />  
        )}
      </Tag>
    )
  },
)
