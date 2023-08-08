import { cookies } from 'next/headers'

import { PROJECT_QUERY } from '@root/graphql/project'
import type { Project } from '@root/payload-cloud-types'

export const fetchProject = async (args: {
  teamID?: string
  projectSlug?: string
}): Promise<Project> => {
  const { teamID, projectSlug } = args || {}
  const token = cookies().get('payload-cloud-token')?.value ?? null

  const doc: Project = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify({
      query: PROJECT_QUERY,
      variables: {
        teamID,
        projectSlug,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Projects?.docs?.[0]
    })

  return doc
}
