import React from 'react'
import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { Pill } from '@components/Pill'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { BranchIcon } from '@root/icons/BranchIcon'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const ProjectCard: React.FC<{
  project: Project
  className?: string
  isLoading?: boolean | null
}> = props => {
  const { project, className, isLoading } = props

  const { team, status, deploymentBranch, repositoryFullName, stripeSubscriptionStatus } =
    project || {}

  const teamSlug = team && typeof team === 'object' ? team?.slug : team

  if (isLoading) {
    // match the card height in css
    return <LoadingShimmer heightPercent={100} shimmerClassName={classes.shimmer} />
  }

  let pill: {
    text: string
    color: 'default' | 'success' | 'warning' | 'error'
  } = {
    text: '',
    color: 'default',
  }

  const isPro =
    project?.plan && typeof project?.plan === 'object' ? project?.plan?.slug === 'pro' : false
  const isTrialing = stripeSubscriptionStatus === 'trialing'
  const isPastDue = stripeSubscriptionStatus === 'past_due' || stripeSubscriptionStatus === 'unpaid'

  return (
    <Link
      href={`/${cloudSlug}/${teamSlug}/${project.slug}${status === 'draft' ? '/configure' : ''}`}
      className={[
        className,
        classes.project,
        status === 'draft' && classes.draft,
        isPastDue && classes.error,
      ]
        .filter(Boolean)
        .join(' ')}
      prefetch={false}
    >
      <div className={classes.pills}>
        {isPro && !isTrialing && <Pill text="Pro" color="success" />}
        {isTrialing && <Pill text={`${isPro ? `Pro ` : ''} Trial`} color="default" />}
        {isPastDue && <Pill text="Past Due" color="error" />}
      </div>
      <h6 className={classes.title}>
        <span>{project.name || 'Project Name'}</span>
      </h6>
      <div className={classes.details}>
        {repositoryFullName && (
          <div className={classes.projectRepo}>
            <GitHubIcon className={classes.githubIcon} />
            <p>{repositoryFullName}</p>
          </div>
        )}
        {deploymentBranch && (
          <div className={classes.projectBranch}>
            <div className={classes.branchIcon}>
              <BranchIcon size="full" />
            </div>
            <p>{deploymentBranch}</p>
          </div>
        )}
      </div>
      <ArrowIcon className={classes.arrowIcon} />
    </Link>
  )
}
