import React from 'react'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchPaymentMethods } from '@cloud/_api/fetchPaymentMethods.js'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { CreditCardList } from '@cloud/_components/CreditCardList/index.js'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'
import { Text } from '@forms/fields/Text/index.js'
import { Metadata } from 'next'

import HR from '@components/MDX/components/HR/index.js'
import { checkTeamRoles } from '@root/utilities/check-team-roles.js'

import classes from './page.module.scss'

export default async ({ params: { 'team-slug': teamSlug } }) => {
  const { user } = await fetchMe()
  const team = await fetchTeamWithCustomer(teamSlug)

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const paymentMethods = await fetchPaymentMethods({ team })

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
          {!isCurrentTeamOwner && (
            <p className={classes.error}>You must be an owner of this team to manage billing.</p>
          )}
          {isCurrentTeamOwner && (
            <React.Fragment>
              <h4>Payment Methods</h4>
              <p>
                The following payment methods are available for this team. Projects that do not
                specify a payment method will use this team's default payment method (if any).
              </p>
              <CreditCardList team={team} initialPaymentMethods={paymentMethods} />
            </React.Fragment>
          )}
          <HR />
          <div className={classes.fields}>
            <Text
              value={team?.stripeCustomerID}
              label="Customer ID"
              disabled
              description="This value was automatically generated when this team was created."
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Billing`,
    openGraph: {
      title: `${teamSlug} - Team Billing`,
      url: `/cloud/${teamSlug}/settings/billing`,
    },
  }
}
