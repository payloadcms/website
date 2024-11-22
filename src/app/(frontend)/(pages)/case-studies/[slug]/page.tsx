import React, { cache } from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchCaseStudies, fetchCaseStudy } from '@data'
import { CaseStudy } from './client_page.js'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index.js'
import { PayloadRedirects } from '@components/PayloadRedirects/index.js'
import { draftMode } from 'next/headers.js'

const getCaseStudy = (slug: string, draft = false) =>
  draft ? fetchCaseStudy(slug, draft) : cache(fetchCaseStudy)(slug, draft)

const CaseStudyBySlug = async ({ params }) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params

  const url = `/case-studies/${slug}`

  const caseStudy = await getCaseStudy(slug, draft)

  if (!caseStudy) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <CaseStudy {...caseStudy} />
    </>
  )
}

export default CaseStudyBySlug

export async function generateStaticParams() {
  const caseStudies = await cache(fetchCaseStudies)()

  return caseStudies.map(({ slug }) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: any
  }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const page = await getCaseStudy(slug, draft)

  const ogImage =
    typeof page?.meta?.image === 'object' &&
    page?.meta?.image !== null &&
    'url' in page?.meta?.image &&
    `${process.env.NEXT_PUBLIC_CMS_URL}${page.meta.image.url}`

  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: mergeOpenGraph({
      title: page?.meta?.title ?? undefined,
      url: `/case-studies/${slug}`,
      description: page?.meta?.description ?? undefined,
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
