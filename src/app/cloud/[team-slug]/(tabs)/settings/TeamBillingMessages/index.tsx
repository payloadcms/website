'use client'

import React from 'react'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod'
import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Message } from '@root/app/_components/Message'

import classes from './index.module.scss'

export const TeamBillingMessages: React.FC<{
  team: TeamWithCustomer
}> = props => {
  const { team } = props
  const pathname = usePathname()

  const billingPath = `/${cloudSlug}/${team?.slug}/settings/billing`
  const isOnBillingPage = pathname === billingPath

  if (!teamHasDefaultPaymentMethod(team) && team?.hasPublishedProjects) {
    return (
      <Message
        className={classes.billingMessages}
        error={
          <React.Fragment>
            {'This team does not have a default payment method set. Please '}
            {isOnBillingPage ? (
              <React.Fragment>{'select a payment method below '}</React.Fragment>
            ) : (
              <Link href={billingPath}>select a payment method</Link>
            )}
            {' as default to ensure your projects stay online.'}
          </React.Fragment>
        }
      />
    )
  }
  return null
}
