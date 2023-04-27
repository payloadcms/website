'use client'

import * as React from 'react'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { useRouteData } from '@cloud/context'

import { LoadingShimmer } from '@components/LoadingShimmer'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { useInvoices } from './useInvoices'

import classes from './page.module.scss'

export const TeamInvoicesPage = () => {
  const { user } = useAuth()
  const { team } = useRouteData()

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const { result: invoices, isLoading } = useInvoices({
    stripeCustomerID: team?.stripeCustomerID,
  })

  return (
    <React.Fragment>
      <SectionHeader
        title="Invoices"
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
          {!isCurrentTeamOwner && (
            <p className={classes.error}>You must be an owner of this team to manage invoices.</p>
          )}
          {isLoading && <LoadingShimmer number={3} />}
          {isLoading === false && invoices && invoices?.length > 0 && (
            <React.Fragment>
              <ul className={classes.list}>
                {invoices &&
                  invoices?.map(subscription => (
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
