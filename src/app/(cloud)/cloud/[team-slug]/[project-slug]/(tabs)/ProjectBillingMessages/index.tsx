import React from 'react'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject.js'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { hasBadSubscription } from '@cloud/_utilities/hasBadSubscription.js'
import { projectHasPaymentMethod } from '@cloud/_utilities/projectHasPaymentMethod.js'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod.js'

import { Gutter } from '@components/Gutter/index.js'
import { BadSubscriptionMessage } from './BadSubscription.js'
import { MissingPaymentMethodMessage } from './MissingPaymentMethod.js'
import { TrialMessage } from './TrialMessage.js'

import classes from './index.module.scss'

export const ProjectBillingMessages: React.FC<{
  team: TeamWithCustomer
  project: ProjectWithSubscription
}> = ({ team, project }) => {
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
