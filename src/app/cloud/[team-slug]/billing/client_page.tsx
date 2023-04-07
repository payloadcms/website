'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { useCustomerPortal } from '@root/utilities/use-customer-portal'

import classes from './page.module.scss'

export const TeamBillingPage = () => {
  const { user } = useAuth()
  const { team } = useRouteData()
  const { openPortalSession, error, loading } = useCustomerPortal({
    team,
    headline: `"${team.name}" Team on Payload Cloud`,
  })

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  return (
    <Gutter>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Team billing
      </Heading>
      <Grid>
        <Cell cols={6} colsM={8}>
          {(loading || error) && (
            <div className={classes.formSate}>
              {loading && <p className={classes.loading}>Opening customer portal...</p>}
              {error && <p className={classes.error}>{error}</p>}
            </div>
          )}
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
                  <p className={classes.description}>
                    {'To manage your billing and payment information, open the '}
                    <a
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
        </Cell>
      </Grid>
    </Gutter>
  )
}
