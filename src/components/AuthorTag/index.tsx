'use client'
import { CommentsIcon } from '@root/graphics/CommentsIcon/index'
import { TwitterIconAlt } from '@root/graphics/TwitterIconAlt/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import getRelativeDate from '@root/utilities/get-relative-date'
import { getTeamTwitter } from '@root/utilities/get-team-twitter'
import Image from 'next/image'
import React from 'react'

import classes from './index.module.scss'

const Timestamp: React.FC<{ date: number | string }> = ({ date }) => {
  const pastDate = typeof date === 'string' ? new Date(date) : new Date(date)
  const timestamp = getRelativeDate(pastDate)

  return <span className={classes.date}>{timestamp}</span>
}

export type Props = {
  author?: string
  className?: string
  date?: number | string
  image?: string
  isAnswer?: boolean
  messageCount?: number
  upvotes?: number
}

const AuthorTag: React.FC<Props> = ({
  author,
  className,
  date,
  image,
  isAnswer,
  messageCount,
  upvotes,
}) => {
  const teamMember = getTeamTwitter(author)

  return (
    <div className={[classes.authorTag, className].filter(Boolean).join(' ')}>
      <div className={classes.authorCell}>
        {image && (
          <div className={classes.authorImageWrap}>
            {teamMember ? (
              <a
                className={classes.authorLink}
                href={`https://twitter.com/${teamMember}`}
                target="_blank"
              >
                <Image alt="discord user avatar" height={45} src={image} width={45} />
              </a>
            ) : (
              <Image alt="default discord avatar" height={45} src={image} width={45} />
            )}
          </div>
        )}

        <div className={classes.authorDetails}>
          <div className={classes.authorName}>
            {teamMember ? (
              <a
                className={[classes.authorLink, teamMember && classes.teamLink]
                  .filter(Boolean)
                  .join(' ')}
                href={`https://twitter.com/${teamMember}`}
                target="_blank"
              >
                <strong>{author}</strong>
                <div className={classes.teamTag}>
                  <span className={classes.twitterIcon}>
                    <TwitterIconAlt />
                  </span>
                </div>
              </a>
            ) : (
              <strong>{author}</strong>
            )}

            {date && <Timestamp date={date} />}
          </div>
        </div>
      </div>

      <div className={classes.commentMetaStats}>
        {upvotes !== undefined && upvotes > 0 && (
          <span>
            <ArrowIcon className={classes.arrowIcon} rotation={-45} /> {upvotes}
          </span>
        )}

        {messageCount !== undefined && messageCount > 0 && (
          <span>
            <CommentsIcon className={classes.messageIcon} /> {messageCount}
          </span>
        )}
      </div>
    </div>
  )
}

export default AuthorTag
