'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Text } from '@forms/fields/Text'

import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { useCustomerPortal } from '@root/utilities/use-customer-portal'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

import classes from './page.module.scss'

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

export default () => {
  const { user } = useAuth()
  const { team, project } = useRouteData()
  const { openPortalSession, error, loading } = useCustomerPortal({
    team,
  })

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  return (
    <MaxWidth>
      <SectionHeader title="Project billing" />
      {(loading || error) && (
        <div className={classes.formSate}>
          {loading && <p className={classes.loading}>Opening customer portal...</p>}
          {error && <p className={classes.error}>{error}</p>}
        </div>
      )}
      {!hasCustomerID && (
        <p className={classes.error}>
          This team does not have a billing account. Please contact support to resolve this issue.
        </p>
      )}
      {hasCustomerID && (
        <React.Fragment>
          <div className={classes.fields}>
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
          </div>
          {!isCurrentTeamOwner && (
            <p className={classes.error}>You must be an owner of this team to manage billing.</p>
          )}
          {isCurrentTeamOwner && (
            <React.Fragment>
              <p>
                {'To manage your subscriptions, payment methods, and billing history, go to the '}
                <a
                  className={classes.stripeLink}
                  onClick={e => {
                    e.preventDefault()
                    openPortalSession(e)
                  }}
                >
                  customer portal
                </a>
                {'.'}
              </p>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </MaxWidth>
  )
}
