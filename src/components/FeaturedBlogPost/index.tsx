import * as React from 'react'
import { formatDate } from '@utilities/format-date-time.js'
import Link from 'next/link'

import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { Media } from '@components/Media/index.js'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index.js'
import { Post } from '@root/payload-types.js'

import classes from './index.module.scss'

export const FeaturedBlogPost: React.FC<Post> = props => {
  const { slug, title, authors, publishedOn, image: media, meta, ...rest } = props

  const href = `/blog/${slug}`

  const author =
    typeof authors?.[0] === 'string' ? authors[0] : authors[0].firstName + ' ' + authors[0].lastName

  return (
    <Link href={href} prefetch={false} className={classes.wrapper}>
      <BackgroundScanline className={[classes.scanline].filter(Boolean).join(' ')} />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairTopLeft].filter(Boolean).join(' ')}
      />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairTopRight].filter(Boolean).join(' ')}
      />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairBottomLeft].filter(Boolean).join(' ')}
      />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairBottomRight].filter(Boolean).join(' ')}
      />
      <div className={classes.contentWrapper}>
        {typeof media !== 'string' && <Media resource={media} className={classes.media} />}
        <div className={classes.content}>
          <h2 className={classes.title}>{title}</h2>

          <div className={classes.meta}>
            <time dateTime={publishedOn} className={classes.date}>
              {formatDate({ date: publishedOn })}
            </time>
            <p className={classes.author}>{author}</p>
          </div>

          <p className={classes.description}>{meta?.description}</p>
        </div>
      </div>
    </Link>
  )
}
