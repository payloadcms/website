import getRelativeDate from '@root/utilities/get-relative-date'
import { getSpecificDateTime } from '@root/utilities/get-specific-date-time'
import React from 'react'
import classes from './index.module.scss'

export type Props = {
  author: string
  className?: string
  date?: Date
  image: string
  platform?: 'Github' | 'Discord'
  url?: string
  comment?: boolean
}

const AuthorTag: React.FC<Props> = ({ author, className, date, image, platform, url, comment }) => {
  return (
    <div className={[classes.authorTag, className].filter(Boolean).join(' ')}>
      <a className={classes.author} href={url}>
        <img src={image} />
        <span>{author}</span>
      </a>
      {date && (!platform || platform === 'Github') && (
        <span className={classes.date}>&nbsp;{getRelativeDate(date)}</span>
      )}
      {date && platform === 'Discord' && (
        <span className={classes.date}>&nbsp;{getSpecificDateTime(date)}</span>
      )}
      {platform && !comment && <span className={classes.platform}>&nbsp;in {platform}</span>}
    </div>
  )
}

export default AuthorTag
