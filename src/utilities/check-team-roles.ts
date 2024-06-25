import type { Team, User } from '@root/payload-cloud-types.js'

export const checkTeamRoles = (
  user: User | null | undefined,
  currentTeam: Team | null | undefined,
  roles: Array<'owner' | 'admin' | 'user'>,
): boolean | undefined => {
  return user?.teams?.some(userTeam => {
    if (
      currentTeam?.id === (typeof userTeam.team === 'string' ? userTeam.team : userTeam?.team?.id)
    ) {
      return roles.every(role => userTeam?.roles?.includes(role))
    }
    return false
  })
}
