import type { Metadata } from 'next'

import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader/index.js'
import { fetchInvoices } from '@cloud/_api/fetchInvoices.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { Message } from '@components/Message/index.js'
import React from 'react'

import { TeamInvoicesPage } from './page_client.js'

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
  const invoices = await fetchInvoices(team)

  const hasCustomerID = team?.stripeCustomerID

  return (
    <React.Fragment>
      <SectionHeader title="Invoices" />
      {!hasCustomerID && (
        <Message error="This team does not have a billing account. Please contact support to resolve this issue." />
      )}
      <TeamInvoicesPage invoices={invoices} team={team} user={user} />
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
      title: `${teamSlug} - Team Invoices`,
      url: `/cloud/${teamSlug}/invoices`,
    },
    title: `${teamSlug} - Team Invoices`,
  }
}
