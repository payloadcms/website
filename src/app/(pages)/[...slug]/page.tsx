import React from 'react'
import { notFound, redirect } from 'next/navigation'

import { fetchPage, fetchPages } from '../../../graphql'
import { CloudLanding } from './CloudLanding'
import { PageContent } from './PageContent'

const Page = async ({ params: { slug } }) => {
  const page = await fetchPage(slug)

  if (!page) return notFound()

  if (slug?.[0] === 'cloud') {
    return <CloudLanding page={page} />
  }

  return <PageContent page={page} />
}

export default Page

export async function generateStaticParams() {
  const pages = await fetchPages()

  return pages.map(({ breadcrumbs }) => ({
    slug: breadcrumbs?.[breadcrumbs.length - 1]?.url?.replace(/^\/|\/$/g, '').split('/'),
  }))
}
