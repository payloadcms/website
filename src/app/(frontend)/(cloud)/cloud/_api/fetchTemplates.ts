import { TEMPLATES } from '@data/templates.js'
import type { Template } from '@root/payload-cloud-types.js'
import { payloadCloudToken } from './token.js'

export const fetchTemplates = async (): Promise<Template[]> => {
  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null

  const doc: Template[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    next: { tags: ['templates'] },
    body: JSON.stringify({
      query: TEMPLATES,
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Templates?.docs
    })

  return doc
}
