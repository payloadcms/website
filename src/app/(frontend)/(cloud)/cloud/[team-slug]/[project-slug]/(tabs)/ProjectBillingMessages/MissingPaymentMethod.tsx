'use client'

import type { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

import { Message } from '@components/Message/index'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Fragment } from 'react'

export const MissingPaymentMethodMessage: React.FC<{
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> = ({ project, team }) => {
  const pathname = usePathname()

  const billingHref = `/cloud/${team?.slug}/${project?.slug}/settings/billing`
  const isOnBillingPage = pathname === billingHref

  return (
    <Message
      error={
        <Fragment>
          {`This project does not have a payment method on file.`}
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
        </Fragment>
      }
    />
  )
}
