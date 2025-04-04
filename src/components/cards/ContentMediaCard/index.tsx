import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { Media } from '@components/Media/index'
import { formatDate } from '@root/utilities/format-date-time'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import type { ContentMediaCardProps } from '../types'

import classes from './index.module.scss'

export const ContentMediaCard: React.FC<ContentMediaCardProps> = (props) => {
  const { authors, className, href, media, publishedOn, style, title } = props

  const author =
    typeof authors === 'string'
      ? authors
      : authors?.[0]
        ? typeof authors?.[0] === 'string'
          ? authors[0]
          : authors[0].firstName + ' ' + authors[0].lastName
        : null

  return (
    <Link
      className={[classes.blogCard, style && classes[style], className && className]
        .filter(Boolean)
        .join(' ')}
      href={href}
      prefetch={false}
    >
      <div className={[classes.contentWrapper, className && className].filter(Boolean).join(' ')}>
        {typeof media === 'string' ? (
          <Image
            alt=""
            className={classes.media}
            height={630}
            sizes="(max-width: 768px) 100vw, 20vw"
            src={media}
            width={1200}
          />
        ) : (
          <Media
            className={classes.media}
            resource={media}
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        )}
        <div className={classes.content}>
          <div className={classes.meta}>
            {publishedOn && (
              <time className={classes.date} dateTime={publishedOn}>
                {formatDate({ date: publishedOn, format: 'shortDateStamp' })}
              </time>
            )}
            {author && <p className={classes.author}>{author}</p>}
          </div>

          <h2 className={classes.title}>{title}</h2>
        </div>
      </div>
      <BackgroundScanline className={classes.scanline} />
    </Link>
  )
}
