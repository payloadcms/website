// Description: Cloud API functions
// Note: This file can only be imported in RSC

import { cookies } from 'next/headers'

import type { Team, User } from '@root/payload-cloud-types'

const getJWT = (): string => {
  const cookieStore = cookies()
  return cookieStore.get(`${process.env.NEXT_PUBLIC_CLOUD_COOKIE_PREFIX}-token`)?.value || ''
}

export const fetchMe = async (): Promise<User> => {
  const endpoint = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/me`

  try {
    const res = await fetch(endpoint, {
      credentials: 'include',
      headers: {
        Authorization: `JWT ${getJWT()}`,
      },
    })

    const { user } = await res.json()

    return user
  } catch (e: unknown) {
    console.error(e)
  }

  return null
}

export const fetchTeamBySlug = async (slug: string): Promise<Team> => {
  const endpoint = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams?where[slug][equals]=${slug}`

  try {
    const res = await fetch(endpoint, {
      credentials: 'include',
      headers: {
        Authorization: `JWT ${getJWT()}`,
      },
    })
    const { docs } = await res.json()
    return docs[0]
  } catch (e: unknown) {
    console.error(e)
  }

  return null
}

export const fetchTeamByID = async (id: string): Promise<Team> => {
  const endpoint = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${id}`

  try {
    const res = await fetch(endpoint, {
      credentials: 'include',
      headers: {
        Authorization: `JWT ${getJWT()}`,
      },
    })
    return res.json()
  } catch (e: unknown) {
    console.error(e)
  }

  return null
}

export const fetchTeamProjectBySlug = async ({
  projectSlug,
  teamSlug,
}: {
  projectSlug: string
  teamSlug: string
}): Promise<Team> => {
  const endpoint = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects?where[0][slug][equals]=${projectSlug}&where[1][owner.slug][equals]=${teamSlug}`

  try {
    const res = await fetch(endpoint, {
      credentials: 'include',
      headers: {
        Authorization: `JWT ${getJWT()}`,
      },
    })
    const { docs } = await res.json()
    return docs[0]
  } catch (e: unknown) {
    console.error(e)
  }

  return null
}
