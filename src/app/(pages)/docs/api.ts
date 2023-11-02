import content from '../../docs.json'
import type { Doc, DocMeta, DocPath, Topic } from './types'

export async function getTopics(): Promise<Topic[]> {
  return content.map(topic => ({
    slug: topic.slug,
    path: topic.path || '/',
    docs: topic.docs.map(doc => ({
      title: doc?.title || '',
      label: doc?.label || '',
      slug: doc?.slug || '',
      order: doc?.order || 0,
      docs: (doc?.docs as DocMeta[]) || null,
      path: doc?.path || '/',
    })),
  }))
}

export async function getDoc({
  topic: topicSlug,
  doc: docPathWithSlug,
}: DocPath): Promise<Doc | null> {
  // Find the matched topic first
  const matchedTopic = content.find(topic => topic.slug.toLowerCase() === topicSlug.toLowerCase())

  // If there's no matched topic, return null early.
  if (!matchedTopic) return null

  // Recursive function to find a doc by slug within a topic or sub-docs
  function findDoc(docs: Doc[], pathAndSlug: string): Doc | null {
    for (const doc of docs) {
      // Check if the current doc matches the slug
      if (doc && (doc.path || '/') + (doc.slug || '/') === pathAndSlug) {
        return doc
      }
      // If the current doc has subdocs, search within them recursively
      if (doc.docs && doc.docs.length > 0) {
        const subDoc = findDoc(doc.docs, pathAndSlug.toLowerCase())
        if (subDoc) {
          return subDoc
        }
      }
    }
    // If no doc matches, return null
    return null
  }

  // Use the recursive function to find the matched doc or subdoc
  return findDoc(matchedTopic.docs || [], docPathWithSlug.toLowerCase())
}
