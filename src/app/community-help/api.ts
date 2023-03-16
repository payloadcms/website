import discussions from '../../../discussions.json'
import threads from '../../../threads.json'
import type { ThreadProps } from './discord/[thread]/render'
import type { DiscussionProps } from './github/[discussion]/render'

export function getAllDiscussions(): DiscussionProps[] | undefined {
  return discussions
}

export function getDiscussion(slug: string): DiscussionProps | undefined {
  const matchedDiscussion = discussions.find(discussion => discussion.slug === slug) as
    | DiscussionProps
    | undefined

  return matchedDiscussion
}

export function getAllThreads(): ThreadProps[] | undefined {
  return threads as ThreadProps[]
}

export function getThread(slug: string): ThreadProps | undefined {
  const matchedThread = threads.find(thread => thread.slug === slug) as ThreadProps

  return matchedThread
}
