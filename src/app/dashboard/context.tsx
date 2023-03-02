'use client'

import React from 'react'

import { fetchTeam, fetchTeamProject } from '@root/graphql'
import { Project, Team } from '@root/payload-cloud-types'
import { usePathnameSegments } from '@root/utilities/use-pathname-segments'

type ContextType = {
  team: Team | undefined
  setTeam: (team: Team) => void // eslint-disable-line no-unused-vars
  project: Project | undefined
  setProject: (project: Project) => void // eslint-disable-line no-unused-vars
  refreshTeam: () => void
  refreshProject: () => void
}
export const Context = React.createContext<ContextType>({
  team: undefined,
  setTeam: undefined,
  project: undefined,
  setProject: undefined,
  refreshTeam: undefined,
  refreshProject: undefined,
})
export const useRouteData = () => React.useContext(Context)

export const RouteDataProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [, teamSlug, projectSlug] = usePathnameSegments()

  const [team, setTeam] = React.useState<Team>()
  const [project, setProject] = React.useState<Project>()

  const refreshProject = React.useCallback(async () => {
    if (team?.id && projectSlug) {
      const foundProject = await fetchTeamProject({ teamID: team.id, projectSlug })
      setProject(foundProject || null)
    }
  }, [team?.id, projectSlug])

  const refreshTeam = React.useCallback(async () => {
    if (teamSlug) {
      const foundTeam = await fetchTeam(teamSlug)
      setTeam(foundTeam || null)
    }
  }, [teamSlug])

  React.useEffect(() => {
    refreshTeam()
  }, [refreshTeam])

  React.useEffect(() => {
    refreshProject()
  }, [refreshProject])

  return (
    <Context.Provider
      value={{
        team,
        setTeam,
        project,
        setProject,
        refreshTeam,
        refreshProject,
      }}
    >
      {children}
    </Context.Provider>
  )
}
