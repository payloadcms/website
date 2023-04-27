'use client'

import * as React from 'react'
import { useRouteData } from '@cloud/context'
import { Text } from '@forms/fields/Text'
import Link from 'next/link'

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

export const ProjectBillingPage = () => {
  const { user } = useAuth()
  const { team, project } = useRouteData()
  const { openPortalSession, error, loading } = useCustomerPortal({
    team,
    subscriptionID: project.stripeSubscriptionID,
    returnURL: `${process.env.NEXT_PUBLIC_SITE_URL}/cloud/${team.slug}/${project.slug}/settings/billing`,
    headline: `"${project.name}" Project on Payload Cloud`,
  })

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID
  const hasSubscriptionID = project?.stripeSubscriptionID

  return (
    <MaxWidth>
      <SectionHeader title="Project billing" className={classes.header} />
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
                <p className={classes.description}>
                  {'To cancel your subscription, '}
                  <a
                    onClick={e => {
                      e.preventDefault()
                      openPortalSession(e)
                    }}
                  >
                    click here
                  </a>
                  {`. This will delete your project permanently. This action cannot be undone.`}
                </p>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
      <p className={classes.description}>
        {`To manage your billing and payment information, go to your `}
        <Link href={`/cloud/${team.slug}/billing`}>team billing page</Link>
        {`.`}
      </p>
    </MaxWidth>
  )
}
