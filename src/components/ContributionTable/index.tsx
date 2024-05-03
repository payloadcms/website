import Link from 'next/link'

import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Partner } from '@root/payload-types'
import { getDiscussion, getPull } from './api'

type ContributionTableProps = {
  contributions: Partner['content']['contributions']
}

import { Suspense } from 'react'

import classes from './index.module.scss'

export const ContributionTable = async ({ contributions }: ContributionTableProps) => {
  if (!contributions || !contributions.length) return null

  return (
    <Suspense>
      <div className={classes.contributionList}>
        {contributions.map(async contribution => {
          if (contribution.type === 'discussion') {
            const { title, url } = await getDiscussion(contribution.number)
            if (!title || !url) return null
            return (
              <Link
                href={url}
                target="_blank"
                className={classes.contribution}
                key={contribution.number}
              >
                <span className={classes.number}>#{contribution.number}</span>
                <span className={classes.title}>{title}</span>
                <ArrowIcon className={classes.arrow} />
              </Link>
            )
          }
          if (contribution.type === 'pr') {
            const { title, url } = await getPull(contribution.number)
            if (!title || !url) return null
            return (
              <Link
                href={url}
                target="_blank"
                className={classes.contribution}
                key={contribution.number}
              >
                <span className={classes.number}>#{contribution.number}</span>
                <span className={classes.title}>{title}</span>
                <ArrowIcon className={classes.arrow} />
              </Link>
            )
          }
        })}
      </div>
    </Suspense>
  )
}
