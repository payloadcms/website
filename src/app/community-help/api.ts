import content from './github/discussions.json'

// TODO: Update types

export async function getAllDiscussions(): Promise<any> {
  return content.map(discussion => ({ ...discussion }))
}

export async function getDiscussion(slug): Promise<any> {
  const matchedDiscussion = content.find(discussion => discussion.slug.toLowerCase() === slug)

  return matchedDiscussion
}
