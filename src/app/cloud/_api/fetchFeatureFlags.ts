import type { FeatureFlag } from '@root/payload-types'

export const fetchFeatureFlags = async (): Promise<FeatureFlag> => {
  const featureFlags: FeatureFlag = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/globals/feature-flags`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then(res => {
    if (!res.ok) throw new Error('Failed to fetch payment method')
    return res.json()
  })

  return featureFlags
}
