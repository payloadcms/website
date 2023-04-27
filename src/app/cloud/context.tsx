'use client'

import React, { useEffect } from 'react'

import { Project, Team } from '@root/payload-cloud-types'
import { useGetProject, useGetTeam } from '@root/utilities/use-cloud-api'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

type ContextType = {
  team: Team | undefined | null
  setTeam: (team: Team) => void
  project: Project | undefined | null
  reloadProject: () => void
  reloadTeam: () => void
}

export const Context = React.createContext<ContextType>({} as ContextType)

export const useRouteData = () => React.useContext(Context)

export const RouteDataProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [, param2, param3] = usePathnameSegments()

  const staticTeamRoutes = ['settings', 'teams']
  const teamSlug = staticTeamRoutes.includes(param2) ? undefined : param2

  const staticProjectRoutes = ['settings', 'logs', 'file-storage', 'database']
  const projectSlug = staticProjectRoutes.includes(param3) ? undefined : param3

  const { result: project, reload: reloadProject } = useGetProject({
    teamSlug,
    projectSlug,
  })

  const { result: team, reload: reloadTeam } = useGetTeam(teamSlug)

  const [currentTeam, setTeam] = React.useState<Team | undefined | null>(team)

  useEffect(() => {
    setTeam(team)
  }, [team])

  return (
    <Context.Provider
      value={{
        team: currentTeam,
        setTeam,
        project,
        reloadProject,
        reloadTeam,
      }}
    >
      {children}
    </Context.Provider>
  )
}
