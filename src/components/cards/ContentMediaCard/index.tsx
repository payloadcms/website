import * as React from 'react'
import Link from 'next/link'

import { Media } from '@components/Media'
import { ContentMediaCardProps } from '../types'

import classes from './index.module.scss'

export const ContentMediaCard: React.FC<ContentMediaCardProps> = props => {
  const { description, href, media, title, className, orientation } = props

  return (
    <div
      className={[classes.blogCard, className && className, orientation && classes[orientation]]
        .filter(Boolean)
        .join(' ')}
    >
      {typeof media !== 'string' && (
        <Link href={href} prefetch={false} className={classes.mediaLink}>
          <Media
            resource={media}
            className={classes.media}
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        </Link>
      )}
      <div className={classes.content}>
        <Link href={href} className={classes.title} prefetch={false}>
          {title}
        </Link>
        <p>{description}</p>
      </div>
    </div>
  )
}
