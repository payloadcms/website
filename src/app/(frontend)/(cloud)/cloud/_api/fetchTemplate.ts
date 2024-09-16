import { TEMPLATE } from '@data/templates.js'
import type { Template } from '@root/payload-cloud-types.js'

export const fetchTemplate = async (templateSlug?: string): Promise<Template> => {
  const doc: Template = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: TEMPLATE,
      variables: {
        slug: templateSlug,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Templates?.docs?.[0]
    })

  return doc
}
