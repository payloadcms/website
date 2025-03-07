import type { Template } from '@root/payload-cloud-types'

import { TEMPLATES } from '@data/templates'

import { payloadCloudToken } from './token'

export const fetchTemplates = async (): Promise<Template[]> => {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null

  const doc: Template[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    body: JSON.stringify({
      query: TEMPLATES,
    }),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    method: 'POST',
    next: { tags: ['templates'] },
  })
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) {
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      }
      return res?.data?.Templates?.docs
    })

  return doc
}
