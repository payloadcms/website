import current from '../../docs.json'
import beta from '../../docs-beta.json'
import legacy from '../../docs-legacy.json'
import type { Doc, DocPath, Topic } from './types'

const docs = {
  current,
  legacy,
  beta,
}

export async function getTopics(
  version: 'current' | 'legacy' | 'beta' = 'current',
): Promise<Topic[]> {
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
  version: 'current' | 'legacy' | 'beta' = 'current',
): Promise<Doc | null> {
  const content = version === 'current' ? current : version === 'legacy' ? legacy : beta

  if (!content || !Array.isArray(content)) {
    return null
  }

  const matchedTopic = content.find(topic => topic.slug.toLowerCase() === topicSlug)
  const matchedDoc = matchedTopic?.docs?.find(doc => doc?.slug === docSlug) || null
  return matchedDoc
}
