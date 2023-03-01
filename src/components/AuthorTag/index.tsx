import React from 'react'
import getRelativeDate from '@root/utilities/get-relative-date'
import { getSpecificDateTime } from '@root/utilities/get-specific-date-time'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { getTeamTwitter } from '@root/utilities/get-team-twitter'
import { TwitterIconV2 } from '@root/graphics/TwitterIconV2'
import { Pill } from '@components/Pill'
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
  isAnswered?: boolean
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
  isAnswered,
}) => {
  const teamMember = getTeamTwitter(author)

  return (
    <div className={[classes.authorTag, className].filter(Boolean).join(' ')}>
      {teamMember ? (
        <div
          className={[classes.author, teamMember && classes.teamMember].filter(Boolean).join(' ')}
        >
          <a className={classes.authorLink} href={`https://twitter.com/${teamMember}`}>
            <img src={image} />
            <strong>{author}</strong>
            <div className={classes.teamTag}>
              <span className={classes.twitterIcon}>
                <TwitterIconV2 />
              </span>
            </div>
          </a>
          <Pill
            className={[isAnswered && classes.isAnswered].filter(Boolean).join(' ')}
            text="Payload Team"
          />
        </div>
      ) : (
        <div className={classes.author}>
          <img src={image} />
          <strong>{author}</strong>
        </div>
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
