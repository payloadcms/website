'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'

import { Button } from '@components/Button'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { useCustomerPortal } from '@root/utilities/use-customer-portal'
import { SectionHeader } from '../_layoutComponents/SectionHeader'

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
    <MaxWidth>
      <SectionHeader
        title="Team billing"
        intro={
          isCurrentTeamOwner
            ? 'All billing is securely managed in Stripe.com, click the link below to access your customer portal and manage your subscriptions.'
            : 'You must be an owner of this team to manage billing.'
        }
      />
      {isCurrentTeamOwner && (
        <React.Fragment>
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
    </MaxWidth>
  )
}
