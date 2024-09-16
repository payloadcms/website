import React from 'react'
import { fetchInvoices } from '@cloud/_api/fetchInvoices.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'
import { Metadata } from 'next'

import { Message } from '@components/Message/index.js'
import { TeamInvoicesPage } from './page_client.js'

export default async ({ params: { 'team-slug': teamSlug } }) => {
  const { user } = await fetchMe()
  const team = await fetchTeamWithCustomer(teamSlug)
  const invoices = await fetchInvoices(team)

  const hasCustomerID = team?.stripeCustomerID

  return (
    <React.Fragment>
      <SectionHeader title="Invoices" />
      {!hasCustomerID && (
        <Message error="This team does not have a billing account. Please contact support to resolve this issue." />
      )}
      <TeamInvoicesPage team={team} invoices={invoices} user={user} />
    </React.Fragment>
  )
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Invoices`,
    openGraph: {
      title: `${teamSlug} - Team Invoices`,
      url: `/cloud/${teamSlug}/invoices`,
    },
  }
}
