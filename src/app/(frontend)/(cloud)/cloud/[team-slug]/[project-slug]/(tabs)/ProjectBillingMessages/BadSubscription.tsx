'use client'

import type { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

import { cloudSlug } from '@cloud/slug'
import { Message } from '@components/Message/index'
import { Project } from '@root/payload-cloud-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const BadSubscriptionMessage: React.FC<{
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> = (props) => {
  const { project, team } = props
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
