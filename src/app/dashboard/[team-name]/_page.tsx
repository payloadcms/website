import React from 'react'

const getTeamData = async teamName => {
  const endpoint = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams?where[name][equals]=${teamName}`

  try {
    const res = await fetch(endpoint, {
      credentials: 'include',
    })
    return res.json()
  } catch (e) {
    console.error(e)
  }

  return null
}
export default async ({ params }) => {
  const { 'team-name': teamName } = params

  const teamData = await getTeamData(teamName)

  return (
    <p>
      {`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamName}`}:{JSON.stringify(teamData)}
    </p>
  )
}
