import type { Attachments } from '@root/app/(frontend)/(pages)/community-help/(posts)/discord/[slug]/client_page'

import { DownloadIcon } from '@root/graphics/DownloadIcon/index'
import Image from 'next/image'
import React from 'react'

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
            <div className={classes.attachmentWrap} key={x}>
              {attachment.url && attachment.name && (
                <a href={attachment.url} target="_blank">
                  {fileIsImage ? (
                    <Image
                      alt={attachment.name}
                      className={classes.image}
                      height={attachment.height}
                      src={attachment.url}
                      width={attachment.width}
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
