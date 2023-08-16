import { TEMPLATES } from '@root/app/_graphql/templates'
import type { Template } from '@root/payload-cloud-types'

export const fetchTemplates = async (): Promise<Template[]> => {
  const doc: Template[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
