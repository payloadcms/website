import type { Project, User } from './payload-cloud-types'

export const checkRole = (allRoles: User['roles'], user: User): boolean => {
  if (user) {
    if (
      (allRoles || []).some((role) => {
        return user?.roles?.some((individualRole) => {
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
  project: null | Project | undefined
  user: null | undefined | User
}): boolean => {
  if (!user) {
    return false
  }

  if (checkRole(['admin'], user)) {
    return true
  }

  const userTeams = user?.teams || []

  const projectTeamID =
    typeof project?.team === 'object' && project?.team !== null && 'id' in project?.team
      ? project?.team.id
      : project?.team

  if (!projectTeamID) {
    return false
  }

  const isTeamOwner = userTeams.find(({ roles, team }) => {
    const userTeamID = typeof team === 'object' && 'id' in team ? team.id : team
    const userIsOnTeam = userTeamID === projectTeamID
    return userIsOnTeam && (roles || []).includes('owner')
  })

  return Boolean(isTeamOwner)
}
