'use client'

import React, { useEffect } from 'react'

import { Project, Team } from '@root/payload-cloud-types'
import { useGetProject, useGetTeam } from '@root/utilities/use-cloud'
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

  const { result: projects, reload: reloadProject } = useGetProject({
    teamSlug,
    projectSlug,
  })

  const { result: teams, reload: reloadTeam } = useGetTeam(teamSlug)

  const [team, setTeam] = React.useState<Team>(teams[0])

  useEffect(() => {
    setTeam(teams[0])
  }, [teams])

  return (
    <Context.Provider
      value={{
        team,
        setTeam,
        project: projects[0],
        reloadProject,
        reloadTeam,
      }}
    >
      {children}
    </Context.Provider>
  )
}
