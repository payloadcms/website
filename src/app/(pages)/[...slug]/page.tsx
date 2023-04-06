import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Hero } from '@components/Hero'
import { RenderBlocks } from '@components/RenderBlocks'
import { fetchPage, fetchPages } from '../../../graphql'

const Page = async ({ params: { slug } }) => {
  const page = await fetchPage(slug)

  if (!page) return notFound()

  return (
    <React.Fragment>
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

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const page = await fetchPage(slug)

  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: {
      url: slug.join('/'),
      images: [
        {
          url:
            typeof page?.meta?.image === 'object' && page.meta.image?.url
              ? page.meta.image.url
              : '',
        },
      ],
    },
  }
}
