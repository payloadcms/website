import type { Team, User } from '@root/payload-cloud-types'

export const checkTeamRoles = (
  user: null | undefined | User,
  currentTeam: null | Team | undefined,
  roles: Array<'admin' | 'owner' | 'user'>,
): boolean | undefined => {
  return user?.teams?.some((userTeam) => {
    if (
      currentTeam?.id === (typeof userTeam.team === 'string' ? userTeam.team : userTeam?.team?.id)
    ) {
      return roles.every((role) => userTeam?.roles?.includes(role))
    }
    return false
  })
}
