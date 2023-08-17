'use client'

import React from 'react'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Message } from '@root/app/_components/Message'
import { Project } from '@root/payload-cloud-types'

export const BadSubscriptionMessage: React.FC<{
  team: TeamWithCustomer
  project: ProjectWithSubscription
}> = props => {
  const { team, project } = props
  const subscriptionStatus = project?.stripeSubscriptionStatus

  const pathname = usePathname()

  const billingPath = `/${cloudSlug}/${team?.slug}/${project?.slug}/settings/billing`
  const isOnBillingPage = pathname === billingPath

  return (
    <Message
      error={
        <React.Fragment>
          {'This project has a subscription status of '}
          <strong>{subscriptionStatus}</strong>
          {'. Please '}
          {isOnBillingPage ? (
            <React.Fragment>{'update the payment method(s) below'}</React.Fragment>
          ) : (
            <Link href={billingPath}>update your payment method(s)</Link>
          )}
          {' to ensure your projects remain online.'}
        </React.Fragment>
      }
    />
  )
}
