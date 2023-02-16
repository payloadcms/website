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
}
export const Context = React.createContext<ContextType>({
  team: undefined,
  setTeam: undefined,
  project: undefined,
  setProject: undefined,
})
export const useRouteData = () => React.useContext(Context)

export const RouteDataProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [, teamSlug, projectSlug] = usePathnameSegments()

  const [team, setTeam] = React.useState<Team>()
  const [project, setProject] = React.useState<Project>()

  React.useEffect(() => {
    const queryTeamBySlug = async () => {
      const foundTeam = await fetchTeam(teamSlug)
      setTeam(foundTeam || null)
    }

    if (teamSlug) {
      queryTeamBySlug()
    }
  }, [teamSlug])

  React.useEffect(() => {
    const queryTeamProject = async () => {
      const foundProject = await fetchTeamProject({ teamID: team.id, projectSlug })
      setProject(foundProject || null)
    }

    if (projectSlug && team?.id) {
      queryTeamProject()
    }
  }, [projectSlug, team?.id])

  return (
    <Context.Provider
      value={{
        team,
        setTeam,
        project,
        setProject,
      }}
    >
      {children}
    </Context.Provider>
  )
}
