import discussions from '../../../discussions.json'
import threads from '../../../threads.json'
import type { ThreadProps } from './discord/[thread]/render'
import type { DiscussionProps } from './github/[discussion]/render'

export async function getAllDiscussions(): Promise<DiscussionProps[] | undefined> {
  return discussions.map(discussion => ({ ...discussion })) as any as DiscussionProps[] // TODO: Fix this
}

export async function getDiscussion(slug: string): Promise<DiscussionProps | undefined> {
  const matchedDiscussion = discussions.find(discussion => discussion.slug === slug) as
    | DiscussionProps
    | undefined

  return matchedDiscussion
}

export async function getAllThreads(): Promise<ThreadProps[] | undefined> {
  return threads.map(thread => ({ ...thread })) as ThreadProps[]
}

export async function getThread(slug: string): Promise<ThreadProps | undefined> {
  const matchedThread = threads.find(thread => thread.slug === slug) as ThreadProps

  return matchedThread
}
