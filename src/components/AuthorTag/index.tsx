import React from 'react'
import getRelativeDate from '@root/utilities/get-relative-date'
import { getSpecificDateTime } from '@root/utilities/get-specific-date-time'
import { CommentsIcon } from '@root/graphics/CommentsIcon'

import classes from './index.module.scss'

export type Props = {
  author: string
  className?: string
  date?: Date
  image: string
  platform?: 'Github' | 'Discord'
  url?: string
  comment?: boolean
  messageCount?: number
}

const AuthorTag: React.FC<Props> = ({
  author,
  className,
  date,
  image,
  platform,
  url,
  comment,
  messageCount,
}) => {
  return (
    <div className={[classes.authorTag, className].filter(Boolean).join(' ')}>
      {url ? (
        <a className={classes.author} href={url}>
          <img src={image} />
          <strong>{author}</strong>
        </a>
      ) : (
        <div className={classes.author}>
          <img src={image} />
          <strong>{author}</strong>
        </div>
      )}
      {date && (!platform || platform === 'Github') && (
        <span className={classes.date}>&nbsp;{getRelativeDate(date)}</span>
      )}
      {date && platform === 'Discord' && (
        <span className={classes.date}>&nbsp;{getSpecificDateTime(date)}</span>
      )}
      {platform && !comment && <span className={classes.platform}>&nbsp;in {platform}</span>}
      {platform === 'Discord' && messageCount && (
        <div className={classes.comments}>
          <CommentsIcon /> <span>{messageCount}</span>
        </div>
      )}
    </div>
  )
}

export default AuthorTag
