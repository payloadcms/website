import { fetchDocs } from '@cloud/_api/fetchDocs'
import { fetchMe } from '@cloud/_api/fetchMe'
import { Metadata } from 'next'

import { Team } from '@root/payload-cloud-types'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TeamsPage } from './page_client'

export default async () => {
  const { token } = await fetchMe()
  const teams = await fetchDocs<Team>('teams', token)
  return <TeamsPage teams={teams} />
}

export const metadata: Metadata = {
  title: `My Teams`,
  openGraph: mergeOpenGraph({
    title: `My Teams`,
    url: `/cloud/teams`,
  }),
}
