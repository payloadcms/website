import React from 'react'
import { notFound } from 'next/navigation'

import { fetchPage, fetchPages } from '../../../graphql'
import { PageContent } from './PageContent'

const Page = async ({ params: { slug } }) => {
  const page = await fetchPage(slug)

  if (!page) return notFound()

  return <PageContent page={page} slug={slug} />
}

export default Page

export async function generateStaticParams() {
  const pages = await fetchPages()

  return pages.map(({ breadcrumbs }) => ({
    slug: breadcrumbs?.[breadcrumbs.length - 1]?.url?.replace(/^\/|\/$/g, '').split('/'),
  }))
}
