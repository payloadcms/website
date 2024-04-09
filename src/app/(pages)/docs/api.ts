import current from '../../docs.json'
import v2 from './(archive)/v2/docs.json'
import type { Doc, DocPath, Topic } from './types'

export async function getTopics(version: 'current' | 'v2' = 'current'): Promise<Topic[]> {
  const content = version === 'current' ? current : v2
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
  version: 'current' | 'v2' = 'current',
): Promise<Doc | null> {
  const content = version === 'current' ? current : v2
  const matchedTopic = content.find(topic => topic.slug.toLowerCase() === topicSlug)
  const matchedDoc = matchedTopic?.docs?.find(doc => doc?.slug === docSlug) || null
  return matchedDoc
}
