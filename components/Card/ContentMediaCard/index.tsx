import * as React from 'react'
import { Button } from '@components/Button'
import { Media } from '@components/Media'
import { BlogCardProps } from '../types'

import classes from './index.module.scss'

export const ContentMediaCard: React.FC<BlogCardProps> = props => {
  const { description, href, media, title, className } = props

  return (
    <div className={[classes.blogCard, className && className].filter(Boolean).join(' ')}>
      {typeof media !== 'string' && <Media resource={media} />}

      <p className={classes.title}>{title}</p>
      <p>{description}</p>

      <Button className={classes.link} href={href} label="Read More" icon="arrow" fullWidth />
    </div>
  )
}
