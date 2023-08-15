import React from 'react'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription'
import { projectHasPaymentMethod } from '@cloud/_utilities/projectHasPaymentMethod'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod'

import { Gutter } from '@components/Gutter'
import { BadSubscriptionMessage } from './BadSubscription'
import { MissingPaymentMethodMessage } from './MissingPaymentMethod'
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

  const hasPaymentError = !projectHasPaymentMethod(project) && !teamHasDefaultPaymentMethod(team)

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

  if (hasPaymentError) {
    return (
      <Gutter className={classes.billingMessages}>
        <MissingPaymentMethodMessage team={team} project={project} />
      </Gutter>
    )
  }

  return null
}
