import React from 'react'
import Link from 'next/link'

import { DiscordIcon } from '@root/graphics/DiscordIcon/index.js'
import { GithubIcon } from '@root/graphics/GithubIcon/index.js'
import { CommunityHelp } from '@root/payload-types.js'

import classes from './index.module.scss'

export type Props = {
  className?: string
  relatedThreads: Partial<CommunityHelp>[]
}

export const RelatedHelpList: React.FC<Props> = ({ relatedThreads }) => {
  const hasRelatedThreads =
    relatedThreads && Array.isArray(relatedThreads) && relatedThreads.length > 0

  return (
    <div className={classes.relatedHelpList}>
      <div className={classes.titleWrapper}>
        <h4 className={classes.title}>Related Help Topics</h4>
      </div>
      <ul className={classes.list}>
        {hasRelatedThreads &&
          relatedThreads.map((thread, i) => {
            const { title, slug, communityHelpType } = thread
            return (
              <li key={i}>
                {communityHelpType === 'discord' && <DiscordIcon className={classes.itemMarker} />}
                {communityHelpType === 'github' && <GithubIcon className={classes.itemMarker} />}
                <Link href={`/community-help/${communityHelpType}/${slug}`}>{title}</Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
