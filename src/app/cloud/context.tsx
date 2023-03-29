'use client'

import React, { useEffect } from 'react'

import { Project, Team } from '@root/payload-cloud-types'
import { useGetProject, useGetTeam } from '@root/utilities/use-cloud-api'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

type ContextType = {
  team: Team
  setTeam: (team: Team) => void
  project: Project
  reloadProject: () => void
  reloadTeam: () => void
}

export const Context = React.createContext<ContextType>({} as ContextType)

export const useRouteData = () => React.useContext(Context)

export const RouteDataProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [, teamSlug, projectSlug] = usePathnameSegments()

  const { result: project, reload: reloadProject } = useGetProject({
    teamSlug,
    projectSlug,
  })

  const { result: team, reload: reloadTeam } = useGetTeam(teamSlug)

  const [selectedTeam, setTeam] = React.useState<Team>(team)

  useEffect(() => {
    setTeam(team)
  }, [team])

  return (
    <Context.Provider
      value={{
        team: selectedTeam,
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
