'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { useCustomerPortal } from '@root/utilities/use-customer-portal'

import classes from './page.module.scss'

const portalURL = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/customer-portal`

export default () => {
  const { user } = useAuth()
  const { team } = useRouteData()
  const { openPortalSession, error, loading } = useCustomerPortal({
    team,
  })

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  return (
    <Gutter>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Team billing
      </Heading>
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
          {!isCurrentTeamOwner && (
            <p className={classes.error}>You must be an owner of this team to manage billing.</p>
          )}
          {isCurrentTeamOwner && (
            <React.Fragment>
              <p>
                {'To manage your billing, please open the '}
                <a
                  className={classes.stripeLink}
                  onClick={e => {
                    e.preventDefault()
                    openPortalSession(e)
                  }}
                >
                  customer portal
                </a>
                {'. There you can manage your subscriptions, payment methods, and billing history.'}
              </p>
              <Button
                href={portalURL}
                onClick={openPortalSession}
                label="Customer Portal"
                appearance="primary"
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Gutter>
  )
}
