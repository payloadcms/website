import current from '@docs/docs.json'
import beta from '@docs/docs-beta.json'
import v2 from '@docs/docs-legacy.json'
import type { Doc, DocPath, Topic } from './types.js'

const docs = {
  current,
  v2,
  beta,
}

export async function getTopics(version: 'current' | 'v2' | 'beta' = 'current'): Promise<Topic[]> {
  const content = docs[version]

  if (!content || !Array.isArray(content)) {
    return []
  }

  return content.map(topic => ({
    slug: topic.slug,
    docs: topic.docs.map(doc => ({
      title: doc?.title || '',
      label: doc?.label || '',
      slug: doc?.slug || '',
      order: doc?.order || 0,
    })),
  }))
}

export async function getDoc(
  { topic: topicSlug, doc: docSlug }: DocPath,
  version: 'current' | 'v2' | 'beta' = 'current',
): Promise<Doc | null> {
  const content = version === 'current' ? current : version === 'v2' ? v2 : beta

  if (!content || !Array.isArray(content)) {
    return null
  }

  const matchedTopic = content.find(topic => topic.slug.toLowerCase() === topicSlug)
  const matchedDoc = matchedTopic?.docs?.find(doc => doc?.slug === docSlug) || null
  return matchedDoc
}
