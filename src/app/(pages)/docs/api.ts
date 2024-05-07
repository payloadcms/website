import beta from '../../_docs/beta-docs.json'
import legacy from '../../_docs/legacy-docs.json'
import current from '../../docs.json'
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

  if (!content) {
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
  const matchedTopic = content.find(topic => topic.slug.toLowerCase() === topicSlug)
  const matchedDoc = matchedTopic?.docs?.find(doc => doc?.slug === docSlug) || null
  return matchedDoc
}
