import React from 'react'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription'

import { Gutter } from '@components/Gutter'
import { BadSubscriptionMessage } from './BadSubscription'
import { TrialMessage } from './TrialMessage'

import classes from './index.module.scss'

export const ProjectBillingMessages: React.FC<{
  team: TeamWithCustomer
  project: ProjectWithSubscription
}> = ({ team, project }) => {
  const isTrialing = Boolean(
    project?.stripeSubscriptionStatus === 'trialing' && project?.stripeSubscription?.trial_end,
  )

  const hasBadSubscriptionStatus = hasBadSubscription(project?.stripeSubscriptionStatus)

  if (hasBadSubscriptionStatus) {
    return (
      <Gutter className={classes.billingMessages}>
        <BadSubscriptionMessage team={team} project={project} />
      </Gutter>
    )
  }

  if (isTrialing) {
    return (
      <Gutter className={classes.billingMessages}>
        <TrialMessage team={team} project={project} />
      </Gutter>
    )
  }

  return null
}
