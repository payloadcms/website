import { RenderDocs } from '@components/RenderDocs'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { fetchDocs } from '../../fetchDocs'
export const dynamic = 'force-static'

type Params = { doc: string; topic: string }

export default async function DocsPage({ params }: { params: Promise<Params> }) {
  const topics = await fetchDocs()

  return <RenderDocs params={await params} topics={topics} />
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { doc: docSlug, topic: topicSlug } = await params
  const topics = await fetchDocs()

  const groupIndex = topics.findIndex(({ topics: tGroup }) =>
    tGroup.some((topic) => topic?.slug?.toLowerCase() === topicSlug),
  )

  const indexInGroup = topics[groupIndex]?.topics?.findIndex(
    (topic) => topic?.slug?.toLowerCase() === topicSlug,
  )

  const topicGroup = topics?.[groupIndex]

  const topic = topicGroup?.topics?.[indexInGroup]

  const docIndex = topic?.docs.findIndex((doc) => doc.slug.replace('.mdx', '') === docSlug)

  const currentDoc = topic?.docs?.[docIndex]

  return {
    description: currentDoc?.desc || `Payload ${topicSlug} Documentation`,
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

export async function generateStaticParams(): Promise<Params[]> {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) {
    return []
  }

  const topics = await fetchDocs()

  const result: Params[] = []

  topics.forEach(({ topics: tGroup }) => {
    tGroup.forEach((topic) => {
      topic?.docs.forEach((doc) => {
        result.push({
          doc: doc.slug.replace('.mdx', ''),
          topic: topic.slug.toLowerCase(),
        })
      })
    })
  })

  return result
}
