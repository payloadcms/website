'use client'

import * as React from 'react'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { Text } from '@forms/fields/Text'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { CreditCardList } from '@components/CreditCardList'
import { HR } from '@root/app/_components/HR'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'

import classes from './page.module.scss'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

export const TeamBillingPage: React.FC<{
  team: TeamWithCustomer
}> = ({ team }) => {
  const { user } = useAuth()

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  return (
    <React.Fragment>
      <SectionHeader
        title="Billing"
        intro={
          <React.Fragment>
            {!hasCustomerID && (
              <p className={classes.error}>
                This team does not have a billing account. Please contact support to resolve this
                issue.
              </p>
            )}
          </React.Fragment>
        }
      />
      {hasCustomerID && (
        <React.Fragment>
          <div className={classes.fields}>
            <Text
              value={team?.stripeCustomerID}
              label="Customer ID"
              disabled
              description="This value was automatically generated when this team was created."
            />
          </div>
          <HR />
          {!isCurrentTeamOwner && (
            <p className={classes.error}>You must be an owner of this team to manage billing.</p>
          )}
          {isCurrentTeamOwner && (
            <React.Fragment>
              <h6>Payment Methods</h6>
              <p>
                The following payment methods are available for this team. Projects that do not
                specify a payment method will use the default payment method set for this team.
              </p>
              <Elements stripe={Stripe}>
                <CreditCardList team={team} />
              </Elements>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
