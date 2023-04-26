'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Text } from '@forms/fields/Text'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { CreditCardSelector } from '@components/CreditCardSelector'
import { Heading } from '@components/Heading'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './page.module.scss'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

const statusLabels = {
  active: 'Active',
  canceled: 'Cancelled',
  incomplete: 'Incomplete',
  incomplete_expired: 'Incomplete Expired',
  past_due: 'Past Due',
  trialing: 'Trialing',
  unpaid: 'Unpaid',
  paused: 'Paused',
  unknown: 'Unknown',
}

export const ProjectBillingPage = () => {
  const { user } = useAuth()
  const { team, project } = useRouteData()

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID
  const hasSubscriptionID = project?.stripeSubscriptionID

  return (
    <MaxWidth>
      <SectionHeader title="Project billing" className={classes.header} />
      {!hasCustomerID && (
        <p className={classes.error}>
          This team does not have a billing account. Please contact support to resolve this issue.
        </p>
      )}
      {!hasSubscriptionID && (
        <p className={classes.error}>
          This project does not have a subscription. Please contact support to resolve this issue.
        </p>
      )}
      <div className={classes.fields}>
        <Text
          value={project?.id}
          label="Project ID"
          disabled
          description="This is your project's ID within Payload"
        />
        {hasCustomerID && hasSubscriptionID && (
          <React.Fragment>
            <Text
              disabled
              value={project?.stripeSubscriptionID}
              label="Subscription ID"
              description="This is the ID of the subscription for this project."
            />
            <Text
              value={statusLabels?.[project?.stripeSubscriptionStatus || 'unknown']}
              label="Subscription Status"
              disabled
            />
            {!isCurrentTeamOwner && (
              <p className={classes.error}>You must be an owner of this team to manage billing.</p>
            )}
            {isCurrentTeamOwner && (
              <React.Fragment>
                <Heading marginBottom={false} element="h6">
                  Payment Method
                </Heading>
                <Elements stripe={Stripe}>
                  <CreditCardSelector
                    team={team}
                    stripeSubscriptionID={project?.stripeSubscriptionID}
                  />
                </Elements>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </MaxWidth>
  )
}
