import type { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription'
import { projectHasPaymentMethod } from '@cloud/_utilities/projectHasPaymentMethod'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod'
import { Gutter } from '@components/Gutter/index'
import React from 'react'

import { BadSubscriptionMessage } from './BadSubscription'
import classes from './index.module.scss'
import { MissingPaymentMethodMessage } from './MissingPaymentMethod'
import { TrialMessage } from './TrialMessage'

export const ProjectBillingMessages: React.FC<{
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> = ({ project, team }) => {
  const isTrialing = Boolean(
    project?.stripeSubscriptionStatus === 'trialing' && project?.stripeSubscription?.trial_end,
  )

  // check if this plan is free, and do not show a message if it is
  // some plans are have pricing that is different than what is offered in the UI
  // so instead of checking `project.plan` we check the amount of the `stripeSubscription`
  const isFreeTier = !project.stripeSubscription?.plan?.amount // could be `0` or `null`

  if (isFreeTier) {
    return null
  }

  const hasBadSubscriptionStatus = hasBadSubscription(project?.stripeSubscriptionStatus)

  const hasPaymentError = !projectHasPaymentMethod(project) && !teamHasDefaultPaymentMethod(team)

  if (hasBadSubscriptionStatus) {
    return (
      <Gutter className={classes.billingMessages}>
        <BadSubscriptionMessage project={project} team={team} />
      </Gutter>
    )
  }

  if (isTrialing) {
    return (
      <Gutter className={classes.billingMessages}>
        <TrialMessage project={project} team={team} />
      </Gutter>
    )
  }

  if (hasPaymentError) {
    return (
      <Gutter className={classes.billingMessages}>
        <MissingPaymentMethodMessage project={project} team={team} />
      </Gutter>
    )
  }

  return null
}
