import type { Post } from '@root/payload-types'

import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { Media } from '@components/Media/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import { formatDate } from '@utilities/format-date-time'
import Link from 'next/link'
import * as React from 'react'

import classes from './index.module.scss'

export const FeaturedBlogPost: React.FC<Partial<Post>> = (props) => {
  const { slug, authors, image: media, meta, publishedOn, title, category, ...rest } = props

  const href = `/${category}/${slug}`

  const author =
    authors && authors[0] && typeof authors[0] !== 'string'
      ? authors[0].firstName + ' ' + authors[0].lastName
      : ''
  const date = publishedOn && formatDate({ date: publishedOn })

  return (
    <Link className={classes.wrapper} href={href} prefetch={false}>
      <BackgroundScanline className={[classes.scanline].filter(Boolean).join(' ')} />
      <div className={classes.contentWrapper}>
        {typeof media !== 'string' && <Media className={classes.media} resource={media} />}
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
