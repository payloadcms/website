import content from '../../docs.json'
import type { Doc, DocMeta, DocPath, Topic } from './types'

export async function getTopics(): Promise<Topic[]> {
  return content.map(topic => ({
    slug: topic.slug,
    docs: topic.docs.map(doc => ({
      title: doc?.title || '',
      label: doc?.label || '',
      slug: doc?.slug || '',
      order: doc?.order || 0,
      docs: (doc?.docs as DocMeta[]) || null,
    })),
  }))
}

export async function getDoc({ topic: topicSlug, doc: docSlug }: DocPath): Promise<Doc | null> {
  const matchedTopic = content.find(topic => topic.fullSlug.toLowerCase() === topicSlug)
  const matchedDoc = matchedTopic?.docs?.find(doc => doc?.slug === docSlug) || null
  return matchedDoc
}
