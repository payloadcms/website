'use client'

import type { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

import { projectHasPaymentMethod } from '@cloud/_utilities/projectHasPaymentMethod'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod'
import { Message } from '@components/Message/index'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Fragment } from 'react'

export const TrialMessage: React.FC<{
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> = ({ project, team }) => {
  const pathname = usePathname()

  const daysLeft = Math.floor(
    (new Date(project?.stripeSubscription?.trial_end * 1000).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24),
  )

  const trialEndDate = new Date(project?.stripeSubscription?.trial_end * 1000).toLocaleDateString()

  const hasPaymentError = !projectHasPaymentMethod(project) && !teamHasDefaultPaymentMethod(team)

  const billingHref = `/cloud/${team?.slug}/${project?.slug}/settings/billing`
  const isOnBillingPage = pathname === billingHref

  const planHref = `/cloud/${team?.slug}/${project?.slug}/settings/plan`
  const isOnPlanPage = pathname === planHref

  // ensure that new projects don't show a warning message so that users do not think they made a mistake
  // we still need to display a message to the user, but not a warning message
  let severity = 'message'
  if (hasPaymentError) {
    severity = daysLeft < 3 ? 'error' : daysLeft < 7 ? 'warning' : 'message'
  }

  return (
    <Message
      {...{
        [severity]: (
          <Fragment>
            {`There ${daysLeft === 1 ? 'is' : 'are'} `}
            <b> {` ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}</b> {` left in your free trial.`}
            {hasPaymentError ? (
              <Fragment>
                {' '}
                {!isOnBillingPage ? (
                  <Link href={billingHref}>Add a payment method</Link>
                ) : (
                  'Add a payment method below'
                )}
                {' to ensure '}
                <b>{project?.slug}</b>
                {` remains online.`}
              </Fragment>
            ) : (
              <Fragment>
                {` We will attempt to charge `}
                {!isOnBillingPage ? (
                  <Link href={billingHref}>your payment method(s)</Link>
                ) : (
                  'the payment method(s) below'
                )}
                {` on ${trialEndDate}. `}
                {!isOnPlanPage ? <Link href={planHref}>Cancel anytime</Link> : 'Cancel anytime'}
                {'.'}
              </Fragment>
            )}
          </Fragment>
        ),
      }}
    />
  )
}
