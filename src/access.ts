import type { Project, User } from './payload-cloud-types'

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
  project: Project
  user: User | null | undefined
}): boolean => {
  if (!user) return false

  if (checkRole(['admin'], user)) return true

  const userTeams = user?.teams || []
  const isTeamOwner = userTeams.find(team => {
    const userIsOnTeam =
      typeof project.team === 'string' ? project.team === team.id : project.team.id === team.id

    return userIsOnTeam && (team.roles || []).includes('owner')
  })

  return Boolean(isTeamOwner)
}
