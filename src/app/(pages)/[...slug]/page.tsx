import React from 'react'
import { notFound } from 'next/navigation'

import { Hero } from '@components/Hero'
import Meta from '@components/Meta'
import { RenderBlocks } from '@components/RenderBlocks'
import { fetchPage, fetchPages } from '../../../graphql'

const Page = async ({ params: { slug } }) => {
  const page = await fetchPage(slug)

  if (!page) return notFound()

  return (
    <React.Fragment>
      <Meta title={page.meta?.title} description={page.meta?.description} slug={slug} />
      <Hero page={page} />
      <RenderBlocks blocks={page.layout} />
    </React.Fragment>
  )
}

export default Page

export async function generateStaticParams() {
  const pages = await fetchPages()

  return pages.map(({ breadcrumbs }) => ({
    slug: breadcrumbs?.[breadcrumbs.length - 1]?.url?.replace(/^\/|\/$/g, '').split('/'),
  }))
}
