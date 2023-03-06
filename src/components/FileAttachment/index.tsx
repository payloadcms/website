import React, { Fragment } from 'react'

import { DownloadIcon } from '@root/graphics/DownloadIcon'

import classes from './index.module.scss'

export type Props = {
  url?: string
  name?: string
}

export const FileAttachment: React.FC<Props> = ({ url, name }) => {
  return (
    <Fragment>
      <a className={classes.attachment} href={url} target="_blank">
        <div className={classes.attachmentName}>{name}</div>
        <DownloadIcon className={classes.downloadIcon} />
      </a>
    </Fragment>
  )
}
