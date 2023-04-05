import React from 'react'
import NextImage from 'next/image'

import { Attachments } from '@root/app/community-help/discord/[slug]/render'
import { DownloadIcon } from '@root/graphics/DownloadIcon'

import classes from './index.module.scss'

export type Props = {
  attachments?: Attachments
}

export const FileAttachments: React.FC<Props> = ({ attachments }) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  const hasFileAttachments = attachments && Array.isArray(attachments) && attachments.length > 0
  const hasOneAttachment = attachments && Array.isArray(attachments) && attachments.length === 1
  return (
    <div
      className={[classes.fileAttachments, hasOneAttachment && classes.oneAttachment]
        .filter(Boolean)
        .join(' ')}
    >
      {hasFileAttachments &&
        attachments.map((attachment, x) => {
          const fileIsImage =
            attachment.contentType && acceptedImageTypes.includes(attachment.contentType)
          return (
            <div key={x} className={classes.attachmentWrap}>
              {attachment.url && attachment.name && (
                <a href={attachment.url} target="_blank">
                  {fileIsImage ? (
                    <NextImage
                      src={attachment.url}
                      alt={attachment.name}
                      width={attachment.width}
                      height={attachment.height}
                      className={classes.image}
                    />
                  ) : (
                    <div className={classes.attachment}>
                      <div className={classes.attachmentName}>{attachment.name}</div>
                      <DownloadIcon className={classes.downloadIcon} />
                    </div>
                  )}
                </a>
              )}
            </div>
          )
        })}
    </div>
  )
}
