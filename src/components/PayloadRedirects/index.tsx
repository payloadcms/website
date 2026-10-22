import type { CaseStudy, Page, Post } from '@types'
import type React from 'react'

import { getCachedDocumentByID } from '@utilities/getDocument'
import { getCachedRedirects } from '@utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const path = url.startsWith('/') ? url : `/${url}`
  const redirects = await getCachedRedirects()()
  const redirectItem = redirects.find((redirect) => redirect.from === path)

  if (redirectItem) {
    if (redirectItem.to?.type === 'custom' && redirectItem.to.url) {
      redirect(redirectItem.to.url)
    }

    const reference = redirectItem.to?.type === 'reference' ? redirectItem.to.reference : undefined

    if (reference?.value) {
      const document =
        typeof reference.value === 'string'
          ? await getCachedDocumentByID(reference.relationTo, reference.value)()
          : reference.value
      let redirectUrl: string | undefined

      if (document) {
        if (reference.relationTo === 'posts') {
          const post = document as Post
          const category =
            typeof post.category === 'string'
              ? await getCachedDocumentByID('categories', post.category)()
              : post.category

          if (category && 'slug' in category && category.slug && post.slug) {
            redirectUrl = `/posts/${category.slug}/${post.slug}`
          }
        } else if (reference.relationTo === 'case-studies') {
          const caseStudy = document as CaseStudy
          if (caseStudy.slug) {
            redirectUrl = `/case-studies/${caseStudy.slug}`
          }
        } else if (reference.relationTo === 'pages') {
          redirectUrl = (document as Page).breadcrumbs?.at(-1)?.url ?? undefined
        }
      }

      if (redirectUrl) {
        redirect(redirectUrl)
      }
    }
  }

  if (disableNotFound) {
    return null
  }
  return notFound()
}
