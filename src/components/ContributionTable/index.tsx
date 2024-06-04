import Link from 'next/link'

import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Partner } from '@root/payload-types'
import { getContribution } from './api'

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
          const { type, number, repo } = contribution
          const { title, url } = await getContribution(type, number, repo)
          if (!title || !url) return null
          return (
            <Link href={url} target="_blank" className={classes.contribution} key={number}>
              <span className={classes.number}>#{number}</span>
              <span className={classes.title}>{title}</span>
              <Pill
                className={classes.pill}
                text={type === 'discussion' ? 'Discussion' : type === 'issue' ? 'Issue' : 'PR'}
                color={type === 'discussion' ? 'default' : type === 'issue' ? 'warning' : 'success'}
              />
            </Link>
          )
        })}
      </div>
    </Suspense>
  )
}
