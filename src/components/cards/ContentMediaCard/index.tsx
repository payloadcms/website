import * as React from 'react'
import Link from 'next/link'

import { Media } from '@components/Media'
import { formatDate } from '@root/utilities/format-date-time'
import { ContentMediaCardProps } from '../types'

import classes from './index.module.scss'

export const ContentMediaCard: React.FC<ContentMediaCardProps> = props => {
  const { publishedOn, href, media, title, className, authors } = props

  const author =
    typeof authors?.[0] === 'string' ? authors[0] : authors[0].firstName + authors[0].lastName

  return (
    <Link
      href={href}
      prefetch={false}
      className={[classes.blogCard, className && className].filter(Boolean).join(' ')}
    >
      <div className={[classes.contentWrapper, className && className].filter(Boolean).join(' ')}>
        {typeof media !== 'string' && (
          <Media
            resource={media}
            className={classes.media}
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        )}
        <div className={classes.content}>
          <div className={classes.meta}>
            {publishedOn && (
              <time dateTime={publishedOn} className={classes.date}>
                {formatDate({ date: publishedOn })}
              </time>
            )}
            <p className={classes.author}>{author}</p>
          </div>

          <h2 className={classes.title}>{title}</h2>
        </div>
      </div>
    </Link>
  )
}
