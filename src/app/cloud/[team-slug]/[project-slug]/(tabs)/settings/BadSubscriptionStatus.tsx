'use client'

import React from 'react'
import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Message } from '@root/app/_components/Message'
import { Project } from '@root/payload-cloud-types'

export const BadSubscriptionStatus: React.FC<{
  subscriptionStatus: Project['stripeSubscriptionStatus']
  teamSlug: string
  projectSlug: string
}> = props => {
  const { subscriptionStatus, teamSlug, projectSlug } = props
  const pathname = usePathname()

  const billingPath = `/${cloudSlug}/${teamSlug}/${projectSlug}/settings/billing`
  const isOnBillingPage = pathname === billingPath

  return (
    <Message
      error={
        <React.Fragment>
          {'This project has a subscription status of '}
          <strong>{subscriptionStatus}</strong>
          {'. Please '}
          {isOnBillingPage ? (
            <React.Fragment>{'update your payment methods below'}</React.Fragment>
          ) : (
            <Link href={billingPath}>update your payment methods</Link>
          )}
          {' to avoid risk of service interruption.'}
        </React.Fragment>
      }
    />
  )
}
