import Link from 'next/link'

import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Partner } from '@root/payload-types'
import { getDiscussion, getIssue, getPull } from './api'

type ContributionTableProps = {
  contributions: Partner['content']['contributions']
}

import { Suspense } from 'react'

import { Pill } from '@components/Pill'

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
                {/* <ArrowIcon className={classes.arrow} /> */}
                <Pill className={classes.pill} text="Discussion" color="default" />
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
                {/* <ArrowIcon className={classes.arrow} /> */}
                <Pill className={classes.pill} text="PR" color="success" />
              </Link>
            )
          }
          if (contribution.type === 'issue') {
            const { title, url } = await getIssue(contribution.number)
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
                {/* <ArrowIcon className={classes.arrow} /> */}
                <Pill className={classes.pill} text="Issue" color="warning" />
              </Link>
            )
          }
          return null
        })}
      </div>
    </Suspense>
  )
}
