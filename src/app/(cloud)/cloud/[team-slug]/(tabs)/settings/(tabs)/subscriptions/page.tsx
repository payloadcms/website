import React, { Fragment } from 'react'
import { Metadata } from 'next'

import { Message } from '@root/app/_components/Message'
import { fetchMe } from '@root/app/(cloud)/cloud/_api/fetchMe'
import { fetchPlans } from '@root/app/(cloud)/cloud/_api/fetchPlans'
import { fetchSubscriptions } from '@root/app/(cloud)/cloud/_api/fetchSubscriptions'
import { fetchTeamWithCustomer } from '@root/app/(cloud)/cloud/_api/fetchTeam'
import { SectionHeader } from '@root/app/(cloud)/cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { TeamSubscriptionsPage } from './page_client'

export default async ({ params: { 'team-slug': teamSlug } }) => {
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
      <TeamSubscriptionsPage team={team} plans={plans} subscriptions={subscriptions} user={user} />
    </Fragment>
  )
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Subscriptions`,
    openGraph: {
      title: `${teamSlug} - Team Subscriptions`,
      url: `/cloud/${teamSlug}/subscriptions`,
    },
  }
}
