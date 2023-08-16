import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchTeams } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TeamsPage } from './page_client'

export default async () => {
  const { user } = await fetchMe()

  const teams = await fetchTeams(
    user?.teams?.map(({ team }) => (team && typeof team === 'object' ? team.id : team || '')) || [],
  )

  return <TeamsPage teams={teams} />
}

export const metadata: Metadata = {
  title: `My Teams`,
  openGraph: mergeOpenGraph({
    title: `My Teams`,
    url: `/cloud/teams`,
  }),
}
