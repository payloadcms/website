import type { Partner } from '@root/payload-types'

import { ArrowIcon } from '@root/icons/ArrowIcon'
import Link from 'next/link'

import { getContribution } from './api'

type ContributionTableProps = {
  contributions: Partner['content']['contributions']
}

import { Pill } from '@components/Pill'
import { Suspense } from 'react'

import classes from './index.module.scss'

export const ContributionTable = async ({ contributions }: ContributionTableProps) => {
  if (!contributions || !contributions.length) {
    return null
  }

  return (
    <Suspense>
      <div className={classes.contributionList}>
        {contributions.map(async (contribution) => {
          const { type, number, repo } = contribution
          const { title, url } = await getContribution(type, number, repo)
          if (!title || !url) {
            return null
          }
          return (
            <Link className={classes.contribution} href={url} key={number} target="_blank">
              <span className={classes.number}>#{number}</span>
              <span className={classes.title}>{title}</span>
              <Pill
                className={classes.pill}
                color={type === 'discussion' ? 'default' : type === 'issue' ? 'warning' : 'success'}
                text={type === 'discussion' ? 'Discussion' : type === 'issue' ? 'Issue' : 'PR'}
              />
            </Link>
          )
        })}
      </div>
    </Suspense>
  )
}
