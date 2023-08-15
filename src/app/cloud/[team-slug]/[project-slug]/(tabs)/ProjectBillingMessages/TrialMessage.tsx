'use client'

import React, { Fragment } from 'react'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { hasDefaultPaymentMethod } from '@cloud/_utilities/hasDefaultPaymentMethod'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Message } from '@root/app/_components/Message'

export const TrialMessage: React.FC<{
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> = ({ project, team }) => {
  const pathname = usePathname()

  const daysLeft = Math.floor(
    (new Date(project?.stripeSubscription?.trial_end * 1000).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24),
  )

  const projectHasPaymentMethod = Boolean(project?.stripeSubscription?.default_payment_method)
  const teamHasDefaultPaymentMethod = hasDefaultPaymentMethod(team)

  const trialEndDate = new Date(project?.stripeSubscription?.trial_end * 1000).toLocaleDateString()

  const hasPaymentError = !projectHasPaymentMethod && !teamHasDefaultPaymentMethod

  const billingHref = `/cloud/${team?.slug}/${project?.slug}/settings/billing`
  const isOnBillingPage = pathname === billingHref
  let severity = 'message'
  if (hasPaymentError) severity = daysLeft < 3 ? 'error' : daysLeft < 7 ? 'warning' : 'message'

  return (
    <Message
      {...{
        [severity]: (
          <Fragment>
            {`There ${daysLeft === 1 ? 'is' : 'are'} `}
            <b> {` ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}</b> {` left in your free trial.`}
            {!projectHasPaymentMethod && !teamHasDefaultPaymentMethod ? (
              <Fragment>
                {' Please '}
                {!isOnBillingPage ? (
                  <Link href={billingHref}>select or add a payment method</Link>
                ) : (
                  'select or add a payment method below'
                )}
                {' to ensure '}
                <b>{project?.slug}</b>
                {` remains online.`}
              </Fragment>
            ) : (
              ` You will be charged at the end of your trial on ${trialEndDate}.`
            )}
          </Fragment>
        ),
      }}
    />
  )
}
