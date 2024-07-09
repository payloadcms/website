import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { RenderDocs } from '@components/RenderDocs'
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

export default async function DocsPage({ params }: { params: { topic: string; doc: string } }) {
  const topics = await fetchDocs(topicOrder)

  return <RenderDocs params={params} topics={topics} />
}

export async function generateMetadata({ params: { topic: topicSlug, doc: docSlug } }) {
  const topics = await fetchDocs(topicOrder)

  const topicIndex = topics.findIndex(topic => topic.slug.toLowerCase() === topicSlug)
  const docIndex = topics[topicIndex].docs.findIndex(
    doc => doc.slug.replace('.mdx', '') === docSlug,
  )

  const currentDoc = topics[topicIndex].docs[docIndex]

  return {
    title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
    description: currentDoc?.desc || `Payload ${topicSlug} Documentation`,
    openGraph: mergeOpenGraph({
      title: `${currentDoc?.title ? `${currentDoc.title} | ` : ''}Documentation | Payload`,
      url: `/docs/${topicSlug}/${docSlug}`,
      images: [
        {
          url: `/api/og?topic=${topicSlug}&title=${currentDoc?.title}`,
        },
      ],
    }),
  }
}
