import { Banner } from '@components/MDX/components/Banner'
import { RenderDocs } from '@components/RenderDocs'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import Link from 'next/link'
import React from 'react'

import { fetchDocs } from '../../../api'

export type TopicsOrder = { topics: string[] }[]

const topicOrder: TopicsOrder = [
  {
    topics: [
      'Getting-Started',
      'Configuration',
      'Database',
      'Fields',
      'Access-Control',
      'Authentication',
      'Hooks',
      'Admin',
    ],
  },
  { topics: ['Local-API', 'REST-API', 'GraphQL', 'Queries'] },
  { topics: ['Rich-Text', 'Lexical', 'Live-Preview', 'Versions', 'Upload', 'Email', 'TypeScript'] },
  { topics: ['Plugins', 'Examples', 'Integrations'] },
  { topics: ['Cloud', 'Production'] },
]

export default async function DocsPage({
  params,
}: {
  params: Promise<{ doc: string; topic: string }>
}) {
  const topics = await fetchDocs(topicOrder, 'beta')

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
  const topics = await fetchDocs(topicOrder, 'beta')

  const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === topicSlug)
  const docIndex = topics[topicIndex]?.docs.findIndex(
    doc => doc.slug.replace('.mdx', '') === docSlug,
  )

  const currentDoc = topics[topicIndex]?.docs[docIndex]

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

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) return []

  const topics = await fetchDocs(topicOrder)

  const result: { doc: string; topic: string }[] = topics.flatMap(topic => {
    return topic.docs?.map(doc => {
      return {
        doc: doc.slug.replace('.mdx', ''),
        topic: topic.slug.toLowerCase(),
      }
    })
  })

  return result
}
