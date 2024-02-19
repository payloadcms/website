import React from 'react'
import { hasBadSubscription } from '@root/app/(cloud)/cloud/_utilities/hasBadSubscription'
import { cloudSlug } from '@root/app/(cloud)/cloud/slug'
import Link from 'next/link'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { Pill } from '@components/Pill'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { BranchIcon } from '@root/icons/BranchIcon'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const ProjectCard: React.FC<{
  project: Partial<Project>
  className?: string
  isLoading?: boolean | null
  showTeamName?: boolean
}> = props => {
  const { project, className, isLoading, showTeamName } = props

  const { team, status, deploymentBranch, repositoryFullName, stripeSubscriptionStatus } =
    project || {}

  const teamSlug = team && typeof team === 'object' ? team?.slug : team

  if (isLoading) {
    // match the card height in css
    return <LoadingShimmer heightPercent={100} shimmerClassName={classes.shimmer} />
  }

  //   <div className={classes.pills}>
  //   {isPro && !isTrialing && <Pill text="Pro" color="success" />}
  //   {isTrialing && <Pill text={`${isPro ? `Pro ` : ''} Trial`} color="default" />}
  //   {isPastDue && <Pill text="Past Due" color="error" />}
  // </div>

  const plan =
    project?.plan && typeof project?.plan === 'object' ? project?.plan?.slug : project?.plan

  const isEnterprise = plan === 'enterprise'
  const isPro = plan === 'pro'
  const isStandard = plan === 'standard'
  const isDraft = project?.status === 'draft'

  const isTrialing = stripeSubscriptionStatus === 'trialing'

  const hasBadSubscriptionStatus = hasBadSubscription(project?.stripeSubscriptionStatus)
  const isDeleted = project?.status === 'deleted'

  let pill: Pick<Parameters<typeof Pill>[0], 'color' | 'text'> = {
    text: '',
    color: 'default',
  }

  if (project?.status === 'draft') {
    pill = {
      text: 'Draft',
      color: 'default',
    }
  }

  if (!isTrialing && !isDraft) {
    if (isPro) {
      pill = {
        text: 'Pro',
        color: 'blue',
      }
    } else if (isStandard) {
      pill = {
        text: 'Standard',
        color: 'default',
      }
    }
  }

  if (isTrialing) {
    pill = {
      text: `${isPro ? `Pro ` : ''} Trial`,
      color: 'warning',
    }
  }

  if (hasBadSubscriptionStatus) {
    pill = {
      text: project?.stripeSubscriptionStatus || 'Error',
      color: 'error',
    }
  }

  if (isDeleted) {
    pill = {
      text: 'Deleted',
      color: 'error',
    }
  }

  // Always show the enterprise pill if the project is enterprise
  if (isEnterprise) {
    pill = {
      text: 'Enterprise',
      color: 'blue',
    }
  }

  // link the card directly to the billing page if the subscription is past due
  let href = `/${cloudSlug}/${teamSlug}/${project.slug}${status === 'draft' ? '/configure' : ''}`
  if (status == 'published' && hasBadSubscriptionStatus)
    href = `/${cloudSlug}/${teamSlug}/${project.slug}/settings/billing`

  return (
    <Link
      href={href}
      className={[
        className,
        classes.project,
        status === 'draft' && classes.draft,
        (hasBadSubscriptionStatus || isDeleted) && classes.error,
      ]
        .filter(Boolean)
        .join(' ')}
      prefetch={false}
    >
      <div className={classes.titleWrapper}>
        <h6 className={classes.title}>
          <span className={classes.projectName}>{project.name || 'Project Name'}</span>
          <span className={classes.pill}>{pill?.text && <Pill {...pill} />}</span>
        </h6>
        <div className={classes.teamName}>
          <p>{`${(showTeamName && team && typeof team === 'object' && `${team?.slug}/`) || ''}${
            project?.slug
          }`}</p>
        </div>
      </div>
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
