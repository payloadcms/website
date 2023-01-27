import * as React from 'react'
import { Media } from '@components/Media'
import Link from 'next/link'
import { Heading } from '@components/Heading'
import { DefaultCardProps } from '../types'

import classes from './index.module.scss'

export const DefaultCard: React.FC<DefaultCardProps> = props => {
  const { description, href, media, title, className, leader } = props

  return (
    <Link
      href={href}
      className={[classes.defaultCard, className && className].filter(Boolean).join(' ')}
    >
      {leader && <span className={classes.leader}>{leader}</span>}
      <Heading element="h2" as="h5">
        {title}
      </Heading>
      <p className={classes.description}>{description}</p>
      {typeof media !== 'string' && (
        <Media resource={media} className={classes.media} sizes="(max-width: 768px) 100vw, 20vw" />
      )}
    </Link>
  )
}
