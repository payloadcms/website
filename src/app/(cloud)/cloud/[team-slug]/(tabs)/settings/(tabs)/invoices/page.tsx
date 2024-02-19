import React from 'react'
import { Metadata } from 'next'

import { Message } from '@root/app/_components/Message'
import { fetchInvoices } from '@root/app/(cloud)/cloud/_api/fetchInvoices'
import { fetchMe } from '@root/app/(cloud)/cloud/_api/fetchMe'
import { fetchTeamWithCustomer } from '@root/app/(cloud)/cloud/_api/fetchTeam'
import { SectionHeader } from '@root/app/(cloud)/cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { TeamInvoicesPage } from './page_client'

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
