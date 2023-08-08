import { PAGE } from '@root/graphql/pages'
import { TEAM } from '@root/graphql/team'
import type { Config } from '../../../payload-types'

const queryMap = {
  pages: {
    query: PAGE,
    key: 'Pages',
  },
  teams: {
    query: TEAM,
    key: 'Teams',
  },
}

export const fetchDoc = async <T>(args: {
  collection: keyof Config['collections']
  slug?: string
  id?: string
  token?: string
}): Promise<T> => {
  const { collection, slug, token } = args || {}

  if (!queryMap[collection]) throw new Error(`Collection ${collection} not found`)

  const doc: T = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify({
      query: queryMap[collection].query,
      variables: {
        slug,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.[queryMap[collection].key]?.docs?.[0]
    })

  return doc
}
