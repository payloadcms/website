import type { Plan } from '@root/payload-cloud-types'

import { PLANS_QUERY } from '@data/plans'

export const fetchPlans = async (): Promise<Plan[]> => {
  const doc: Plan[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    body: JSON.stringify({
      query: PLANS_QUERY,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) {
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      }
      return res?.data?.Plans?.docs
    })

  return doc
}
