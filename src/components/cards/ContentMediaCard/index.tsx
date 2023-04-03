import * as React from 'react'
import Link from 'next/link'

import { Media } from '@components/Media'
import { BlogCardProps } from '../types'

import classes from './index.module.scss'

export const ContentMediaCard: React.FC<BlogCardProps> = props => {
  const { description, href, media, title, className } = props

  return (
    <div className={[classes.blogCard, className && className].filter(Boolean).join(' ')}>
      {typeof media !== 'string' && (
        <Link href={href}>
          <Media
            resource={media}
            className={classes.media}
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        </Link>
      )}

      <Link href={href} className={classes.title}>
        {title}
      </Link>

      <p>{description}</p>
    </div>
  )
}
