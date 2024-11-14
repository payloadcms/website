import { Banner } from '@components/MDX/components/Banner'
import { RenderDocs } from '@components/RenderDocs'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { fetchDocs } from '../../../api'

export type TopicsOrder = { topics: string[] }[]

export default async function DocsPage({
  params,
}: {
  params: Promise<{ doc: string; topic: string }>
}) {
  if (process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true') {
    redirect('/docs')
  }

  const topics = fetchDocs('v3')

  return (
    <RenderDocs params={await params} topics={topics} version="beta">
      <Banner type="warning">
        <strong>Note:</strong> You are currently viewing the <strong>beta</strong> version of the
        docs. Some docs may be inaccurate or incomplete at the moment.{' '}
        <Link href="/docs">Switch to the latest version</Link>
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
  const topics = fetchDocs('v3')

  const groupIndex = topics.findIndex(({ topics: tGroup }) =>
    tGroup.some(topic => topic?.slug?.toLowerCase() === topicSlug),
  )

  const indexInGroup = topics[groupIndex].topics.findIndex(
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
    robots: 'noindex, nofollow, noarchive',
    title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
  }
}

export function generateStaticParams() {
  if (
    process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS ||
    process.env.NEXT_PUBLIC_ENABLE_BETA_DOCS !== 'true'
  )
    return []

  const topics = fetchDocs('v3')

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
