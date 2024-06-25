import type { Project, User } from './payload-cloud-types.js'

export const checkRole = (allRoles: User['roles'], user: User): boolean => {
  if (user) {
    if (
      (allRoles || []).some(role => {
        return user?.roles?.some(individualRole => {
          return individualRole === role
        })
      })
    ) {
      return true
    }
  }

  return false
}

export const canUserMangeProject = ({
  project,
  user,
}: {
  project: Project | null | undefined
  user: User | null | undefined
}): boolean => {
  if (!user) return false

  if (checkRole(['admin'], user)) return true

  const userTeams = user?.teams || []

  const projectTeamID =
    typeof project?.team === 'object' && project?.team !== null && 'id' in project?.team
      ? project?.team.id
      : project?.team

  if (!projectTeamID) return false

  const isTeamOwner = userTeams.find(({ team, roles }) => {
    const userTeamID = typeof team === 'object' && 'id' in team ? team.id : team
    const userIsOnTeam = userTeamID === projectTeamID
    return userIsOnTeam && (roles || []).includes('owner')
  })

  return Boolean(isTeamOwner)
}
