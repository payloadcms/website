'use client'

import React from 'react'
import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Message } from '@root/app/_components/Message'

export const MissingDefaultPaymentMethod: React.FC<{
  teamSlug: string
}> = props => {
  const { teamSlug } = props
  const pathname = usePathname()

  const billingPath = `/${cloudSlug}/${teamSlug}/settings/billing`
  const isOnBillingPage = pathname === billingPath

  return (
    <Message
      error={
        <React.Fragment>
          {'This team does not have a default payment method set. Please '}
          {isOnBillingPage ? (
            <React.Fragment>{'select a payment method below '}</React.Fragment>
          ) : (
            <Link href={billingPath}>select a payment method</Link>
          )}
          {' as default to avoid risk of service interruption.'}
        </React.Fragment>
      }
    />
  )
}
