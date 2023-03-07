import React, { Fragment } from 'react'
import NextImage from 'next/image'
import { DownloadIcon } from '@root/graphics/DownloadIcon'

import classes from './index.module.scss'

export type Props = {
  url?: string
  name?: string
  width?: number
  height?: number
  contentType?:
  | 'image/png'
  | 'video/MP2T'
  | 'text/plain'
  | 'application/json'
  | 'video/quicktime'
  | 'image/jpeg'
}

export const FileAttachment: React.FC<Props> = ({ url, name, width, height, contentType }) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  const fileIsImage = contentType && acceptedImageTypes.includes(contentType)
  return (
    <Fragment>
      {url && name && (
        <a className={classes.attachmentWrap} href={url} target="_blank">
          {fileIsImage ? (
            <NextImage
              src={url}
              alt={name}
              width={width}
              height={height}
              className={classes.image}
            />
          ) : (
            <div className={classes.attachment}>
              <div className={classes.attachmentName}>{name}</div>
              <DownloadIcon className={classes.downloadIcon} />
            </div>
          )}
        </a>
      )}
    </Fragment>
  )
}
