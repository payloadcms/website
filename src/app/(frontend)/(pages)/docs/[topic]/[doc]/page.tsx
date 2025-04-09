import { PayloadRedirects } from '@components/PayloadRedirects'
import { RenderDocs } from '@components/RenderDocs'
import config from '@payload-config'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { getPayload } from 'payload'
import React from 'react'

import { fetchTopicsForSidebar } from '../../fetchTopicsForSidebar'

export const dynamic = 'force-static'

type Params = { doc: string; topic: string }

export default async function DocsPage({ params }: { params: Promise<Params> }) {
  const { doc: docSlug, topic: topicSlug } = await params

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
        equals: 'v3',
      },
    },
  })

  const topicGroups = await fetchTopicsForSidebar({ payload, version: 'v3' })

  if (!curDoc?.docs?.length) {
    return <PayloadRedirects url={`/docs/${topicSlug}/${docSlug}`} />
  }

  const doc = curDoc.docs[0]

  return (
    <RenderDocs
      currentDoc={doc}
      docSlug={docSlug}
      topicGroups={topicGroups}
      topicSlug={topicSlug}
    />
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
        equals: 'v3',
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
    title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
  }
}

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true

export async function generateStaticParams(): Promise<Params[]> {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) {
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
        equals: 'v3',
      },
    },
  })

  const result: Params[] = []

  for (const doc of docs.docs) {
    result.push({
      doc: doc.slug.replace('.mdx', ''),
      topic: doc.topic.toLowerCase(),
    })
  }

  return result
}
