export const getTeamData = async (teamName: string): Promise<any> => {
  const endpoint = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams?where[name][equals]=${teamName}`

  try {
    const res = await fetch(endpoint, {
      credentials: 'include',
    })
    return res.json()
  } catch (e: unknown) {
    console.error(e)
  }

  return null
}
