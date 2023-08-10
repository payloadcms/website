import React, { Fragment } from 'react'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchPlans } from '@cloud/_api/fetchPlans'
import { fetchSubscriptions } from '@cloud/_api/fetchSubscriptions'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { Metadata } from 'next'

import { Message } from '@root/app/_components/Message'
import { TeamSubscriptionsPage } from './page_client'

export default async function TeamSubscriptionsWrapper({ params: { 'team-slug': teamSlug } }) {
  const { user } = await fetchMe()
  const team = await fetchTeam(teamSlug)
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
