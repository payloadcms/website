import { Banner } from '@components/Banner'
/* eslint-disable no-restricted-exports */
import { RenderDocs } from '@components/RenderDocs'
import config from '@payload-config'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { fetchTopicsForSidebar } from '../../../fetchTopicsForSidebar'

export type TopicsOrder = { topics: string[] }[]

type Params = { doc: string; topic: string }

export default async function DocsPage({ params }: { params: Promise<Params> }) {
  const { doc: docSlug, topic: topicSlug } = await params

  if (process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true') {
    redirect(`/docs/${topicSlug}/${docSlug}`)
  }

  const payload = await getPayload({ config })

  const curDoc = await payload.find({
    collection: 'docs',
    where: {
      slug: {
        equals: docSlug,
      },
      topic: {
        equals: topicSlug,
      },
      version: {
        equals: 'v2',
      },
    },
  })

  const topicGroups = await fetchTopicsForSidebar({ payload, version: 'v2' })

  if (!curDoc?.docs?.length) {
    notFound()
  }

  const doc = curDoc.docs[0]

  return (
    <RenderDocs
      currentDoc={doc}
      docSlug={docSlug}
      topicGroups={topicGroups}
      topicSlug={topicSlug}
      version="v2"
    >
      <Banner type="warning">
        You are currently viewing documentation for version 2 of Payload.
      </Banner>
    </RenderDocs>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string; topic: string }>
}) {
  const { doc: docSlug, topic: topicSlug } = await params
  const payload = await getPayload({ config })
  const docs = await payload.find({
    collection: 'docs',
    where: {
      slug: {
        equals: docSlug,
      },
      topic: {
        equals: topicSlug,
      },
      version: {
        equals: 'v2',
      },
    },
  })

  const currentDoc = docs?.docs?.[0]

  return {
    description: currentDoc?.description || `Payload ${topicSlug} Documentation`,
    openGraph: mergeOpenGraph({
      images: [
        {
          url: `/api/og?topic=${topicSlug}&title=${currentDoc?.title}`,
        },
      ],
      title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
      url: `/docs/${topicSlug}/${docSlug}`,
    }),
    robots: 'noindex, nofollow, noarchive',
    title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  if (
    process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS ||
    process.env.NEXT_PUBLIC_ENABLE_LEGACY_DOCS !== 'true'
  ) {
    return []
  }

  const payload = await getPayload({ config })
  const docs = await payload.find({
    collection: 'docs',
    where: {
      version: {
        equals: 'v2',
      },
    },
  })

  const result: Params[] = []

  docs?.docs?.forEach((doc) => {
    result.push({
      doc: doc.slug.replace('.mdx', ''),
      topic: doc.topic.toLowerCase(),
    })
  })

  return result
}
