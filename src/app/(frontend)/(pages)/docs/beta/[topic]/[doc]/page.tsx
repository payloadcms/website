import { Banner } from '@components/Banner'
import { RenderDocs } from '@components/RenderDocs'
import config from '@payload-config'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { fetchTopicsForSidebar } from '../../../fetchTopicsForSidebar'

type Params = { doc: string; topic: string }

export const dynamic = 'force-static'

export default async function DocsPage({ params }: { params: Promise<Params> }) {
  const { doc: docSlug, topic: topicSlug } = await params

  if (process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true') {
    redirect(`/docs/${topicSlug}/${docSlug}`)
  }

  const payload = await getPayload({ config })
  const curDoc = await payload.find({
    collection: 'docs',
    pagination: false,
    where: {
      slug: {
        equals: docSlug,
      },
      topic: {
        equals: topicSlug,
      },
      version: {
        equals: 'v4',
      },
    },
  })

  const topicGroups = await fetchTopicsForSidebar({ payload, version: 'v4' })

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
      version="beta"
    >
      <Banner type="warning">
        You are currently viewing documentation for Payload 4 beta. Some documentation may be
        incomplete or change before release.
      </Banner>
    </RenderDocs>
  )
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { doc: docSlug, topic: topicSlug } = await params
  const payload = await getPayload({ config })
  const docs = await payload.find({
    collection: 'docs',
    depth: 0,
    pagination: false,
    select: {
      description: true,
      title: true,
    },
    where: {
      slug: {
        equals: docSlug,
      },
      topic: {
        equals: topicSlug,
      },
      version: {
        equals: 'v4',
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
      url: `/docs/beta/${topicSlug}/${docSlug}`,
    }),
    robots: 'noindex, nofollow, noarchive',
    title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
  }
}

export const dynamicParams = true

export async function generateStaticParams(): Promise<Params[]> {
  if (
    process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS ||
    process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true'
  ) {
    return []
  }

  const payload = await getPayload({ config })
  const docs = await payload.find({
    collection: 'docs',
    depth: 0,
    limit: 10000,
    pagination: false,
    select: {
      slug: true,
      topic: true,
    },
    where: {
      version: {
        equals: 'v4',
      },
    },
  })

  return docs.docs.map((doc) => ({
    doc: doc.slug.replace('.mdx', ''),
    topic: doc.topic.toLowerCase(),
  }))
}
