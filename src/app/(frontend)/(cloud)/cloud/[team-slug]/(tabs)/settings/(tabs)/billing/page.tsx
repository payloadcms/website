import type { Metadata } from 'next'

import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchPaymentMethods } from '@cloud/_api/fetchPaymentMethods'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { CreditCardList } from '@cloud/_components/CreditCardList/index'
import { HR } from '@components/HR'
import { Text } from '@forms/fields/Text/index'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import React from 'react'

import classes from './page.module.scss'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
  }>
}) => {
  const { 'team-slug': teamSlug } = await params
  const { user } = await fetchMe()
  const team = await fetchTeamWithCustomer(teamSlug)

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const paymentMethods = await fetchPaymentMethods({ team })

  return (
    <React.Fragment>
      <SectionHeader
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
        title="Billing"
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
              <CreditCardList initialPaymentMethods={paymentMethods} team={team} />
            </React.Fragment>
          )}
          <HR />
          <div className={classes.fields}>
            <Text
              description="This value was automatically generated when this team was created."
              disabled
              label="Customer ID"
              value={team?.stripeCustomerID}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'team-slug': string
  }>
}): Promise<Metadata> {
  const { 'team-slug': teamSlug } = await params
  return {
    openGraph: {
      title: `${teamSlug} - Team Billing`,
      url: `/cloud/${teamSlug}/settings/billing`,
    },
    title: `${teamSlug} - Team Billing`,
  }
}
