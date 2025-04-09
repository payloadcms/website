import type { ElementType } from 'react'

import React, { Fragment } from 'react'

import type { Props } from './types'

import { Image } from './Image/index'
import { Video } from './Video/index'

export const Media = ({
  ref,
  ...props
}: {
  ref?: React.RefObject<HTMLDivElement | HTMLImageElement | HTMLVideoElement | null>
} & Omit<Props, 'ref'>) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource !== 'string' && resource?.mimeType?.includes('video')
  const Tag = (htmlElement as ElementType) || Fragment

  return (
    <Tag ref={ref} {...(htmlElement !== null ? { className } : {})}>
      {isVideo ? <Video {...props} /> : <Image {...props} />}
    </Tag>
  )
}
