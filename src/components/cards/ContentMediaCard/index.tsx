import * as React from 'react'
import { Media } from '@components/Media'
import { CMSLink } from '@components/CMSLink'
import { BlogCardProps } from '../types'

import classes from './index.module.scss'

export const ContentMediaCard: React.FC<BlogCardProps> = props => {
  const { description, href, media, title, className } = props

  return (
    <div className={[classes.blogCard, className && className].filter(Boolean).join(' ')}>
      {typeof media !== 'string' && (
        <CMSLink url={href}>
          <Media resource={media} />
        </CMSLink>
      )}

      <CMSLink url={href} className={classes.title}>
        {title}
      </CMSLink>

      <p>{description}</p>
    </div>
  )
}
