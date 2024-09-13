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
  'Lexical',
  'Live-Preview',
  'Access-Control',
  'Hooks',
  'Authentication',
  'Versions',
  'Upload',
  'GraphQL',
  'REST-API',
  'Local-API',
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

type Param = {
  doc: string
  topic: string
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_BUILD_DOCS) return []

  const topics = await fetchDocs(topicOrder)

  const result = topics.reduce((params: Param[], topic) => {
    return params.concat(
      topic.docs
        .map(doc => {
          if (!doc.slug) return null as any

          return {
            doc: doc.slug,
            topic: topic.slug.toLowerCase(),
          }
        })
        .filter(Boolean),
    )
  }, [])

  return result
}
