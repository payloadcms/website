import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Hero } from '@components/Hero/index.js'
import { RenderBlocks } from '@components/RenderBlocks/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchPage, fetchPages } from '@data'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave'
import { PayloadRedirects } from '@components/PayloadRedirects'

const Page = async ({ params: { slug } }) => {
  const url = '/' + (Array.isArray(slug) ? slug.join('/') : slug)

  const page = await fetchPage(slug)

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <React.Fragment>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <Hero page={page} firstContentBlock={page.layout[0]} />
      <RenderBlocks blocks={page.layout} hero={page.hero} />
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

  const ogImage =
    typeof page?.meta?.image === 'object' &&
    page?.meta?.image !== null &&
    'url' in page?.meta?.image &&
    `${process.env.NEXT_PUBLIC_CMS_URL}${page.meta.image.url}`

  return {
    title: page?.meta?.title || 'Payload',
    description: page?.meta?.description,
    openGraph: mergeOpenGraph({
      title: page?.meta?.title || 'Payload',
      description: page?.meta?.description ?? undefined,
      url: Array.isArray(slug) ? slug.join('/') : '/',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
  }
}
