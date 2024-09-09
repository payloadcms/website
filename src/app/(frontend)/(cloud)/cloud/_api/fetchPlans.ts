import { PLANS_QUERY } from '@data/plans.js'
import type { Plan } from '@root/payload-cloud-types.js'

export const fetchPlans = async (): Promise<Plan[]> => {
  const doc: Plan[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: PLANS_QUERY,
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Plans?.docs
    })

  return doc
}
