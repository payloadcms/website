import { RenderDocs } from '@components/RenderDocs'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { fetchDocs } from '../../api'

export default async function DocsPage({
  params,
}: {
  params: Promise<{ doc: string; topic: string }>
}) {
  const topics = fetchDocs()

  return <RenderDocs params={await params} topics={topics} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string; topic: string }>
}) {
  const { doc: docSlug, topic: topicSlug } = await params
  const topics = fetchDocs()

  const groupIndex = topics.findIndex(({ topics: tGroup }) =>
    tGroup.some(topic => topic?.slug?.toLowerCase() === topicSlug),
  )

  const indexInGroup = topics[groupIndex]?.topics?.findIndex(
    topic => topic?.slug?.toLowerCase() === topicSlug,
  )

  const topicGroup = topics?.[groupIndex]

  const topic = topicGroup?.topics?.[indexInGroup]

  const docIndex = topic?.docs.findIndex(doc => doc.slug.replace('.mdx', '') === docSlug)

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

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) {return []}

  const topics = fetchDocs()

  const result: { doc: string; topic: string }[] = []

  topics.forEach(({ topics: tGroup }) => {
    tGroup.forEach(topic => {
      topic?.docs.forEach(doc => {
        result.push({
          doc: doc.slug.replace('.mdx', ''),
          topic: topic.slug.toLowerCase(),
        })
      })
    })
  })

  return result
}
