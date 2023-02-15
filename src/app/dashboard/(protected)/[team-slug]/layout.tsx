import * as React from 'react'
import { fetchTeamBySlug } from '@rsc-api/cloud'

import { TeamProvider } from './context'

type TeamLayoutType = {
  children: React.ReactNode
  params: {
    'team-slug': string
  }
}

export default async ({ children, params }: TeamLayoutType) => {
  const { 'team-slug': teamSlug } = params
  const team = await fetchTeamBySlug(teamSlug)

  return <TeamProvider team={team}>{children}</TeamProvider>
}
