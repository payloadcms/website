import content from '../../docs.json'
import type { Doc, DocPath, Topic } from './types'

export async function getTopics(): Promise<Topic[]> {
  return content.map(topic => ({
    slug: topic.slug,
    docs: topic.docs.map(doc => ({
      title: doc.title,
      label: doc.label,
      slug: doc.slug,
      order: doc.order,
    })),
  }))
}

export async function getDoc({ topic: topicSlug, doc: docSlug }: DocPath): Promise<Doc> {
  const matchedTopic = content.find(topic => topic.slug.toLowerCase() === topicSlug)
  const matchedDoc = matchedTopic.docs.find(doc => doc.slug === docSlug)
  return matchedDoc
}
