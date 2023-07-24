import React from 'react'
import Link from 'next/link'

import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { GithubIcon } from '@root/graphics/GithubIcon'

import classes from './index.module.scss'

export type Props = {
  className?: string
}

export const RelatedHelpList: React.FC<Props> = () => {
  return (
    <div className={classes.relatedHelpList}>
      <div className={classes.titleWrapper}>
        <h4 className={classes.title}>Related Help Topics</h4>
      </div>
      <ul className={classes.list}>
        <li>
          <DiscordIcon className={classes.itemMarker} />
          <Link href={`/community-help`}>Dynamic description</Link>
        </li>
        <li>
          <DiscordIcon className={classes.itemMarker} />
          <Link href={`/community-help`}>Payload + Gatsby</Link>
        </li>
        <li>
          <GithubIcon className={classes.itemMarker} />
          <Link href={`/community-help`}>
            Bulk editing incorrectly setting all slug fields to the same value
          </Link>
        </li>
        <li>
          <DiscordIcon className={classes.itemMarker} />
          <Link href={`/community-help`}>Unable to specify depth</Link>
        </li>
        <li>
          <GithubIcon className={classes.itemMarker} />
          <Link href={`/community-help`}>REST API - Basic Auth</Link>
        </li>
      </ul>
    </div>
  )
}
