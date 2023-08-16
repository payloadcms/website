import { TEAMS } from '@root/app/_graphql/team'
import type { Config } from '../../../payload-cloud-types'
import { PAGES } from '../../_graphql/pages'

const queryMap = {
  pages: {
    query: PAGES,
    key: 'Pages',
  },
  teams: {
    query: TEAMS,
    key: 'Teams',
  },
}

export const fetchDocs = async <T>(
  collection: keyof Config['collections'],
  token?: string,
): Promise<T[]> => {
  if (!queryMap[collection]) throw new Error(`Collection ${collection} not found`)

  const docs: T[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify({
      query: queryMap[collection].query,
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')

      return res?.data?.[queryMap[collection].key]?.docs
    })

  return docs
}
