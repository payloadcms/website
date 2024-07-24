'use client'
import React from 'react'
import Image from 'next/image'

import { CommentsIcon } from '@root/graphics/CommentsIcon/index.js'
import { TwitterIconAlt } from '@root/graphics/TwitterIconAlt/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import getRelativeDate from '@root/utilities/get-relative-date.js'
import { getTeamTwitter } from '@root/utilities/get-team-twitter.js'

import classes from './index.module.scss'

const Timestamp: React.FC<{ date: string | number }> = ({ date }) => {
  const pastDate = typeof date === 'string' ? new Date(date) : new Date(date)
  const timestamp = getRelativeDate(pastDate)

  return <span className={classes.date}>{timestamp}</span>
}

export type Props = {
  author?: string
  className?: string
  date?: string | number
  image?: string
  messageCount?: number
  upvotes?: number
  isAnswer?: boolean
}

const AuthorTag: React.FC<Props> = ({
  author,
  className,
  date,
  image,
  messageCount,
  upvotes,
  isAnswer,
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
                <Image src={image} width={45} height={45} alt="discord user avatar" />
              </a>
            ) : (
              <Image src={image} width={45} height={45} alt="default discord avatar" />
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
            <ArrowIcon rotation={-45} className={classes.arrowIcon} /> {upvotes}
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
