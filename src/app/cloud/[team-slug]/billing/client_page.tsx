'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { CreditCardList } from '@components/CreditCardList'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'

import classes from './page.module.scss'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

export const TeamBillingPage = () => {
  const { user } = useAuth()
  const { team } = useRouteData()

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  return (
    <Gutter>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Team billing
      </Heading>
      <Grid>
        <Cell cols={6} colsM={8}>
          {!hasCustomerID && (
            <p className={classes.error}>
              This team does not have a billing account. Please contact support to resolve this
              issue.
            </p>
          )}
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
              {!isCurrentTeamOwner && (
                <p className={classes.error}>
                  You must be an owner of this team to manage billing.
                </p>
              )}
              {isCurrentTeamOwner && (
                <React.Fragment>
                  <h6>Payment Methods</h6>
                  <Elements stripe={Stripe}>
                    <CreditCardList team={team} />
                  </Elements>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Cell>
      </Grid>
    </Gutter>
  )
}
