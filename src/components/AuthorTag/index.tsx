import React from 'react'

import { Pill } from '@components/Pill'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { TwitterIconV2 } from '@root/graphics/TwitterIconV2'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import getRelativeDate from '@root/utilities/get-relative-date'
import { getTeamTwitter } from '@root/utilities/get-team-twitter'

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
        <div className={classes.authorImageWrap}>
          {teamMember ? (
            <a
              className={classes.authorLink}
              href={`https://twitter.com/${teamMember}`}
              target="_blank"
            >
              <img src={image} /> {/* eslint-disable-line @next/next/no-img-element */}
            </a>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} />
          )}
        </div>

        <div className={classes.authorDetails}>
          <div className={classes.authorName}>
            {teamMember ? (
              <>
                <a
                  className={classes.authorLink}
                  href={`https://twitter.com/${teamMember}`}
                  target="_blank"
                >
                  <strong>{author}</strong>
                  <div className={classes.teamTag}>
                    <span className={classes.twitterIcon}>
                      <TwitterIconV2 />
                    </span>
                  </div>
                </a>

                <Pill
                  className={[isAnswer && classes.isAnswer].filter(Boolean).join(' ')}
                  text="Payload Team"
                />
              </>
            ) : (
              <strong>{author}</strong>
            )}
          </div>

          {date && <Timestamp date={date} />}
        </div>
      </div>

      <div className={classes.commentMetaStats}>
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
