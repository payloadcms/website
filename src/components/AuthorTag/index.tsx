import getRelativeDate from '@root/utilities/get-relative-date'
import React from 'react'
import classes from './index.module.scss'

export type Props = {
  author: string
  className?: string
  date?: Date
  image: string
  platform?: string
  url?: string
}

const AuthorTag: React.FC<Props> = ({ author, className, date, image, platform, url }) => {
  return (
    <div className={[classes.authorTag, className].filter(Boolean).join(' ')}>
      <a className={classes.author} href={url}>
        <img src={image} />
        <span>{author}</span>
      </a>
      {date && <span className={classes.date}>{getRelativeDate(date)}</span>}
      {platform && <span className={classes.platform}>in {platform}</span>}
    </div>
  )
}

export default AuthorTag
