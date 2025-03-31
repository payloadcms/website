import type { Post } from '@root/payload-types'

import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { Media } from '@components/Media/index'
import { formatDate } from '@utilities/format-date-time'
import Link from 'next/link'
import * as React from 'react'

import classes from './index.module.scss'

export const FeaturedBlogPost: React.FC<{ category: string } & Partial<Post>> = (props) => {
  const {
    slug,
    authors,
    category,
    dynamicThumbnail,
    featuredMedia,
    image,
    meta,
    publishedOn,
    thumbnail,
    title,
  } = props

  const href = `/posts/${category}/${slug}`

  const author =
    authors && authors[0] && typeof authors[0] !== 'string'
      ? authors[0].firstName + ' ' + authors[0].lastName
      : ''
  const date = publishedOn && formatDate({ date: publishedOn })

  return (
    <Link className={classes.wrapper} href={href} prefetch={false}>
      <BackgroundScanline className={[classes.scanline].filter(Boolean).join(' ')} />
      <div className={classes.contentWrapper}>
        {featuredMedia === 'upload' ? (
          image && typeof image !== 'string' && <Media className={classes.media} resource={image} />
        ) : dynamicThumbnail ? (
          <Media
            className={classes.media}
            height={630}
            src={`/api/og?type=${category}&title=${title}`}
            width={1200}
          />
        ) : (
          thumbnail &&
          typeof thumbnail !== 'string' && <Media className={classes.media} resource={thumbnail} />
        )}
        <div className={classes.content}>
          <h2 className={classes.title}>{title}</h2>

          <div className={classes.meta}>
            {date && (
              <time className={classes.date} dateTime={publishedOn}>
                {date}
              </time>
            )}
            {author && <p className={classes.author}>{author}</p>}
          </div>

          <p className={classes.description}>{meta?.description}</p>
        </div>
      </div>
    </Link>
  )
}
