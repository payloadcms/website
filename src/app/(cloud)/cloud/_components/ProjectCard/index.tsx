import React from 'react'
import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription.js'
import { cloudSlug } from '@cloud/slug.js'
import Link from 'next/link'

import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { LoadingShimmer } from '@components/LoadingShimmer/index.js'
import { Pill } from '@components/Pill/index.js'
import { GitHubIcon } from '@root/graphics/GitHub/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { BranchIcon } from '@root/icons/BranchIcon/index.js'
import { Project } from '@root/payload-cloud-types.js'

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
  const isSuspended = project?.status === 'suspended'

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
        color: 'success',
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

  if (isSuspended) {
    pill = {
      text: 'Suspended',
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
        'cols-4 cols-m-4 cols-s-8',
        className,
        classes.project,
        status === 'draft' && classes.draft,
        (hasBadSubscriptionStatus || isDeleted) && classes.error,
      ]
        .filter(Boolean)
        .join(' ')}
      prefetch={false}
    >
      <BackgroundScanline className={classes.scanlines} />
      <div className={classes.titleWrapper}>
        <div className={classes.title}>
          <h5 className={classes.projectName}>{project.name || 'Project Name'}</h5>
          <ArrowIcon size="medium" className={classes.arrow} />
        </div>
        <p className={classes.teamName}>{`${
          (showTeamName && team && typeof team === 'object' && `${team?.slug}/`) || ''
        }${project?.slug}`}</p>
      </div>
      <div className={classes.details}>
        {pill?.text && <Pill {...pill} />}
        {repositoryFullName && (
          <div className={classes.iconText}>
            <GitHubIcon className={classes.githubIcon} />
            <span>{repositoryFullName}</span>
          </div>
        )}
        {deploymentBranch && (
          <div className={classes.iconText}>
            <BranchIcon size="medium" />
            <span>{deploymentBranch}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
