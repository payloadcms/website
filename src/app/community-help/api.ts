import discussions from './github/discussions.json'
import threads from './discord/threads.json'

// TODO: Update types

export async function getAllDiscussions(): Promise<any> {
  return discussions.map(discussion => ({ ...discussion }))
}

export async function getDiscussion(slug: string): Promise<any> {
  const matchedDiscussion = discussions.find(discussion => discussion.slug.toLowerCase() === slug)

  return matchedDiscussion
}

export async function getAllThreads(): Promise<any> {
  return threads.map(thread => ({ ...thread }))
}

export async function getThread(id: string): Promise<any> {
  const matchedThread = threads.find(thread => thread.info.id === id)

  return matchedThread
}
