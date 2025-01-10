import type { Metadata } from 'next'

import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchPlans } from '@cloud/_api/fetchPlans.js'
import { fetchSubscriptions } from '@cloud/_api/fetchSubscriptions.js'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { Message } from '@components/Message/index.js'
import React, { Fragment } from 'react'

import { TeamSubscriptionsPage } from './page_client.js'

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
  const plans = await fetchPlans()
  const subscriptions = await fetchSubscriptions(team)

  const hasCustomerID = team?.stripeCustomerID

  return (
    <Fragment>
      <SectionHeader title="Subscriptions" />
      {!hasCustomerID && (
        <Message error="This team does not have a billing account. Please contact support to resolve this issue." />
      )}
      <TeamSubscriptionsPage plans={plans} subscriptions={subscriptions} team={team} user={user} />
    </Fragment>
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
      title: `${teamSlug} - Team Subscriptions`,
      url: `/cloud/${teamSlug}/subscriptions`,
    },
    title: `${teamSlug} - Team Subscriptions`,
  }
}
