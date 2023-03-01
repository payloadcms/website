import React from 'react'
import getRelativeDate from '@root/utilities/get-relative-date'
import { getSpecificDateTime } from '@root/utilities/get-specific-date-time'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { getTeamTwitter } from '@root/utilities/get-team-twitter'
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
  upvotes?: number
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
  upvotes,
}) => {
  const teamMember = getTeamTwitter(author)

  return (
    <div className={[classes.authorTag, className].filter(Boolean).join(' ')}>
      <a className={classes.author} href={url || ''}>
        <img src={image} />
        <strong>{author}</strong>
      </a>
      {teamMember && (
        <a href={`https://twitter.com/${teamMember}`} className={classes.teamTag}>
          <label>&nbsp;TEAM</label>
        </a>
      )}
      {date && (
        <span className={classes.date}>
          {platform === 'Discord' ? getSpecificDateTime(date) : getRelativeDate(date)}
        </span>
      )}
      {platform && !comment && <span className={classes.platform}>&nbsp;in {platform}</span>}
      <div className={classes.upvotes}>
        {upvotes && (
          <span>
            <ArrowIcon rotation={-45} /> {upvotes}
          </span>
        )}
        {messageCount && messageCount > 0 && (
          <span>
            <CommentsIcon /> {messageCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default AuthorTag
