import type { Project } from '@root/payload-cloud-types'

import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription'
import { cloudSlug } from '@cloud/slug'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { LoadingShimmer } from '@components/LoadingShimmer/index'
import { Pill } from '@components/Pill/index'
import { GitHubIcon } from '@root/graphics/GitHub/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { BranchIcon } from '@root/icons/BranchIcon/index'
import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export const ProjectCard: React.FC<{
  className?: string
  isLoading?: boolean | null
  project: Partial<Project>
  showTeamName?: boolean
}> = (props) => {
  const { className, isLoading, project, showTeamName } = props

  const { deploymentBranch, repositoryFullName, status, stripeSubscriptionStatus, team } =
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
    color: 'default',
    text: '',
  }

  if (project?.status === 'draft') {
    pill = {
      color: 'default',
      text: 'Draft',
    }
  }

  if (!isTrialing && !isDraft) {
    if (isPro) {
      pill = {
        color: 'success',
        text: 'Pro',
      }
    } else if (isStandard) {
      pill = {
        color: 'default',
        text: 'Standard',
      }
    }
  }

  if (isTrialing) {
    pill = {
      color: 'warning',
      text: `${isPro ? `Pro ` : ''} Trial`,
    }
  }

  if (hasBadSubscriptionStatus) {
    pill = {
      color: 'error',
      text: project?.stripeSubscriptionStatus || 'Error',
    }
  }

  if (isDeleted) {
    pill = {
      color: 'error',
      text: 'Deleted',
    }
  }

  if (isSuspended) {
    pill = {
      color: 'error',
      text: 'Suspended',
    }
  }

  // Always show the enterprise pill if the project is enterprise
  if (isEnterprise) {
    pill = {
      color: 'blue',
      text: 'Enterprise',
    }
  }

  // link the card directly to the billing page if the subscription is past due
  let href = `/${cloudSlug}/${teamSlug}/${project.slug}${status === 'draft' ? '/configure' : ''}`
  if (status == 'published' && hasBadSubscriptionStatus) {
    href = `/${cloudSlug}/${teamSlug}/${project.slug}/settings/billing`
  }

  return (
    <Link
      className={[
        'cols-4 cols-m-4 cols-s-8',
        className,
        classes.project,
        status === 'draft' && classes.draft,
        (hasBadSubscriptionStatus || isDeleted) && classes.error,
      ]
        .filter(Boolean)
        .join(' ')}
      href={href}
      prefetch={false}
    >
      <BackgroundScanline className={classes.scanlines} />
      <div className={classes.titleWrapper}>
        <div className={classes.title}>
          <h5 className={classes.projectName}>{project.name || 'Project Name'}</h5>
          <ArrowIcon className={classes.arrow} size="medium" />
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
