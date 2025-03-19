import { Heading } from '@components/Heading/index'
import { Media } from '@components/Media/index'
import { Pill } from '@components/Pill/index'
import { PlusIcon } from '@root/icons/PlusIcon/index'
import Link from 'next/link'
import * as React from 'react'

import type { DefaultCardProps } from '../types'

import classes from './index.module.scss'

export const DefaultCard: React.FC<DefaultCardProps> = (props) => {
  const { className, description, href, leader, media, pill, title } = props

  return (
    <Link
      className={[classes.defaultCard, className && className].filter(Boolean).join(' ')}
      href={href || ''}
      prefetch={false}
    >
      <div className={classes.content}>
        <div className={classes.leaderWrapper}>
          {leader && <div className={classes.leader}>{leader}</div>}
          {pill && (
            <span className={classes.pill}>
              <Pill color="warning" text={pill} />
            </span>
          )}
        </div>
        <Heading as="h4" element="h2" marginTop={false}>
          {title}
        </Heading>
        <div className={classes.plusIcon}>
          <PlusIcon size="full" />
        </div>
        <p className={classes.description}>{description}</p>
      </div>
      {media && typeof media !== 'string' && (
        <Media
          alt={media.alt}
          className={classes.media}
          height={media.height}
          sizes="(max-width: 768px) 100vw, 20vw"
          src={media.url}
          width={media.width}
        />
      )}
    </Link>
  )
}
