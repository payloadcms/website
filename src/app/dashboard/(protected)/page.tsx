import { fetchMe, fetchTeamByID } from '@rsc-api/cloud'
import { redirect } from 'next/navigation'

export default async () => {
  const user = await fetchMe()
  const teamDoc =
    typeof user.defaultTeam === 'string' ? await fetchTeamByID(user.defaultTeam) : user.defaultTeam
  return redirect(`/dashboard/${teamDoc.name}`)
}
