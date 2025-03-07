import type { Metadata } from 'next'

import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'

import { TeamMembersPage } from './page_client'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
  }>
}) => {
  const { 'team-slug': teamSlug } = await params
  const team = await fetchTeamWithCustomer(teamSlug)
  return <TeamMembersPage team={team} />
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
      title: `${teamSlug} - Team Members`,
      url: `/cloud/${teamSlug}/settings/members`,
    },
    title: `${teamSlug} - Team Members`,
  }
}
