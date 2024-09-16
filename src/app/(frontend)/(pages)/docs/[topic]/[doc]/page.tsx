import { RenderDocs } from '@components/RenderDocs'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { fetchDocs } from '../../api'

const topicOrder = [
  'Getting-Started',
  'Configuration',
  'Database',
  'Fields',
  'Admin',
  'Rich-Text',
  'Live-Preview',
  'Access-Control',
  'Hooks',
  'Authentication',
  'Versions',
  'Upload',
  'Local-API',
  'REST-API',
  'GraphQL',
  'Queries',
  'Production',
  'Email',
  'TypeScript',
  'Plugins',
  'Examples',
  'Integrations',
  'Cloud',
]

export default async function DocsPage({ params }: { params: { doc: string; topic: string } }) {
  const topics = await fetchDocs(topicOrder)

  return <RenderDocs params={params} topics={topics} />
}

export async function generateMetadata({ params: { doc: docSlug, topic: topicSlug } }) {
  const topics = await fetchDocs(topicOrder)

  const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === topicSlug)
  const docIndex = topics[topicIndex].docs.findIndex(
    doc => doc.slug.replace('.mdx', '') === docSlug,
  )

  const currentDoc = topics[topicIndex].docs[docIndex]

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

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) return []

  const topics = await fetchDocs(topicOrder)

  const result: { doc: string; topic: string }[] = topics.flatMap(topic => {
    return topic.docs.map(doc => {
      return {
        doc: doc.slug.replace('.mdx', ''),
        topic: topic.slug.toLowerCase(),
      }
    })
  })

  return result
}
