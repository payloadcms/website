import * as React from 'react'
import { Media } from '@components/Media'
import Link from 'next/link'
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
      <h2 className={classes.title}>{title}</h2>
      <p className={classes.description}>{description}</p>
      {typeof media !== 'string' && (
        <Link href={href}>
          <Media
            resource={media}
            className={classes.media}
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        </Link>
      )}
    </Link>
  )
}
