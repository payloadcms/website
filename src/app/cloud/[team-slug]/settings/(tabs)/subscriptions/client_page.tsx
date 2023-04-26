'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'

import { Heading } from '@components/Heading'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { useSubscriptions } from './useSubscriptions'

import classes from './page.module.scss'

export const TeamSubscriptionsPage = () => {
  const { user } = useAuth()
  const { team } = useRouteData()

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const { result: subscriptions, isLoading } = useSubscriptions({
    stripeCustomerID: team?.stripeCustomerID,
  })

  return (
    <React.Fragment>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Subscriptions
      </Heading>
      {!hasCustomerID && (
        <p className={classes.error}>
          This team does not have a billing account. Please contact support to resolve this issue.
        </p>
      )}
      {hasCustomerID && (
        <React.Fragment>
          {!isCurrentTeamOwner && (
            <p className={classes.error}>
              You must be an owner of this team to manage subscriptions.
            </p>
          )}
          {isLoading && <LoadingShimmer number={3} />}
          {isLoading === false && subscriptions && subscriptions?.length > 0 && (
            <React.Fragment>
              <ul className={classes.list}>
                {subscriptions &&
                  subscriptions?.map(subscription => (
                    <li key={subscription.id}>
                      {subscription.id} - {subscription.status}
                    </li>
                  ))}
              </ul>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
