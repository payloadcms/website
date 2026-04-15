import type { Metadata } from 'next'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index'
import { PayloadRedirects } from '@components/PayloadRedirects/index'
import { RefreshRouteOnSave } from '@components/RefreshRouterOnSave/index'
import { Release } from '@components/Release/index'
import { fetchRelease, fetchReleases } from '@data'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import React from 'react'

const getRelease = async (slug: string, draft?: boolean) =>
  draft
    ? await fetchRelease(slug)
    : await unstable_cache(fetchRelease, ['release', `release-${slug}`])(slug)

const ReleasePage = async ({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params

  const release = await getRelease(slug, draft)

  const url = `/posts/releases/${slug}`

  if (!release) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <PayloadRedirects disableNotFound url={url} />
      <RefreshRouteOnSave />
      <BreadcrumbsBar breadcrumbs={[]} hero={{ type: 'default' }} />
      <Release {...release} />
    </>
  )
}

export default ReleasePage

export async function generateStaticParams() {
  const getReleases = unstable_cache(fetchReleases, ['allReleases'])
  const releases = await getReleases()

  return releases
    .filter((release) => release.slug)
    .map(({ slug }) => ({
      slug,
    }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const release = await getRelease(slug, draft)

  let ogImage: null | string = null

  if (release) {
    if (release?.meta?.image && typeof release.meta.image !== 'string' && release.meta.image?.url) {
      ogImage = release.meta.image.url
    } else if (release.image && typeof release.image !== 'string' && release.image?.url) {
      ogImage = release.image.url
    } else {
      ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?type=releases&title=${encodeURIComponent(release.title || '')}`
    }
  }

  return {
    description: release?.meta?.description,
    openGraph: mergeOpenGraph({
      description: release?.meta?.description ?? undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: release?.title ?? undefined,
      url: `/posts/releases/${slug}`,
    }),
    title: release?.title ? `${release.title} | Payload` : 'Release | Payload',
  }
}
