import { fetchTeam } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { TeamInvoicesPage } from './page_client'

export default async function TeamInvoicesWrapper({ params: { 'team-slug': teamSlug } }) {
  const team = await fetchTeam(teamSlug)
  return <TeamInvoicesPage team={team} />
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
