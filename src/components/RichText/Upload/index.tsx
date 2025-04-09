import type { CMSLinkType } from '@components/CMSLink/index'
import type { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import type { Media as MediaType } from '@types'
import type { TypedUploadCollection, UploadCollectionSlug } from 'payload'

import { CMSLink } from '@components/CMSLink/index'
import { Media } from '@components/Media/index'
import React from 'react'

export type RichTextUploadNodeType = {
  fields: {
    enableLink?: boolean
    link?: CMSLinkType
  }
  relationTo: string
  value?: MediaType
}

export type Props = {
  className?: string
  node: SerializedUploadNode
}

export const RichTextUpload: React.FC<Props> = (props) => {
  const {
    className,
    node: { fields, value },
  } = props

  let Wrap: React.ComponentType<CMSLinkType> | string = 'div'

  const styles: React.CSSProperties = {}

  let wrapProps: CMSLinkType = {}

  if (fields?.enableLink) {
    Wrap = CMSLink
    wrapProps = {
      ...fields?.link,
    }
  }

  return (
    typeof value !== 'string' &&
    typeof value !== 'number' && (
      <div className={className} style={styles}>
        <Wrap {...wrapProps}>
          <Media resource={value as TypedUploadCollection[UploadCollectionSlug]} />
        </Wrap>
      </div>
    )
  )
}

export default RichTextUpload
