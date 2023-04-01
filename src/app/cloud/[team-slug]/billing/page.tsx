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

  return (
    <Gutter>
      <Heading marginTop={false} element="h1" as="h6" className={classes.title}>
        Team billing
      </Heading>
      {!isCurrentTeamOwner && (
        <p className={classes.error}>You must be an owner of this team to manage billing.</p>
      )}
      {isCurrentTeamOwner && (
        <React.Fragment>
          <p>
            {'All billing is securely managed in '}
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.stripeLink}
            >
              Stripe.com
            </a>
            , click the link below to access your customer portal and manage your subscriptions.
          </p>
          {(loading || error) && (
            <div className={classes.formSate}>
              {loading && <p className={classes.loading}>Loading...</p>}
              {error && <p className={classes.error}>{error}</p>}
            </div>
          )}
          <Button
            href={portalURL}
            onClick={openPortalSession}
            label="Customer Portal"
            appearance="primary"
          />
        </React.Fragment>
      )}
    </Gutter>
  )
}
