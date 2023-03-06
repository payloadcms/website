import discussions from '../../../discussions.json'
import threads from '../../../threads.json'
import type { ThreadProps } from './discord/[thread]/render'
import type { DiscussionProps } from './github/[discussion]/render'

// TODO: Update types

export async function getAllDiscussions(): Promise<DiscussionProps[] | undefined> {
  return discussions.map(discussion => ({ ...discussion })) as any as DiscussionProps[] // TODO: Fix this
}

export async function getDiscussion(id: string): Promise<DiscussionProps | undefined> {
  const matchedDiscussion = discussions.find(
    discussion => discussion.id === id,
  ) as any as DiscussionProps // TODO: Fix this

  return matchedDiscussion
}

export async function getAllThreads(): Promise<ThreadProps[] | undefined> {
  return threads.map(thread => ({ ...thread })) as any as ThreadProps[] // TODO: Fix this
}

export async function getThread(id: string): Promise<ThreadProps | undefined> {
  const matchedThread = threads.find(thread => thread.info.id === id) as any as ThreadProps // TODO: Fix this

  return matchedThread
}
