'use client'

import * as React from 'react'
import { redirect } from 'next/navigation'

import { useRouteData } from '../context'

type ProjectLayoutType = {
  children: React.ReactNode
}

export const TeamPageLayout = ({ children }: ProjectLayoutType) => {
  const { team, reloadTeam } = useRouteData()

  React.useEffect(() => {
    reloadTeam()
  }, [reloadTeam])

  if (team === undefined) return null

  if (team === null) redirect(`/cloud?error=${encodeURIComponent('Team not found')}`)

  return <React.Fragment>{children}</React.Fragment>
}
