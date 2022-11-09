import { notFound } from 'next/navigation'
import React from 'react'
import { Hero } from '../../components/Hero'
import { RenderBlocks } from '../../components/RenderBlocks'
import { fetchPage, fetchPages } from '../../graphql'
import { UpdateTitle } from './updateTitle'

const Page = async ({ params: { slug } }) => {
  const page = await fetchPage(slug)

  if (!page) return notFound()

  return (
    <React.Fragment>
      <UpdateTitle title={page.meta?.title || page.title} />
      <Hero page={page} />
      <RenderBlocks blocks={page.layout} />
    </React.Fragment>
  )
}

export default Page

export async function generateStaticParams() {
  const pages = await fetchPages()

  return pages.map(({ breadcrumbs }) => ({
    slug: breadcrumbs[breadcrumbs.length - 1].url.replace(/^\/|\/$/g, '').split('/'),
  }))
}
