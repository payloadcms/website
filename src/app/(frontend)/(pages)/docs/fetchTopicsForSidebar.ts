import type { ParsedDocForNav, TopicForNav, TopicGroupForNav } from '@root/collections/Docs/types'
import type { Payload } from 'payload'

import { topicOrder } from '@root/collections/Docs/topicOrder'

export const fetchTopicsForSidebar = async ({
  payload,
  version,
}: {
  payload: Payload
  version: 'v2' | 'v3'
}): Promise<TopicGroupForNav[]> => {
  const result = await payload.find({
    collection: 'docs',
    depth: 0,
    limit: 10000,
    pagination: false,
    select: {
      slug: true,
      label: true,
      order: true,
      title: true,
      topic: true,
      topicGroup: true,
    },
    where: {
      version: {
        equals: version,
      },
    },
  })

  const docs = result.docs

  const topicGroups: TopicGroupForNav[] = topicOrder[version]
    .map(
      ({ groupLabel, topics: topicsGroup }) => ({
        groupLabel,
        topics: topicsGroup.map((key) => {
          const topicSlug = key.toLowerCase()

          const docsForTopic = docs.filter(
            (doc) => doc.topic === topicSlug && doc.topicGroup === groupLabel,
          )

          const parsedDocs: ParsedDocForNav[] = docsForTopic
            .map((doc) => {
              return {
                slug: doc.slug,
                label: doc.label ?? '',
                order: doc.order ?? 0,
                title: doc.title ?? '',
              }
            })
            .filter(Boolean) as ParsedDocForNav[]

          return {
            slug: topicSlug,
            docs: parsedDocs.sort((a, b) => a.order - b.order),
            label: key,
          } as TopicForNav
        }),
      }),
      [],
    )
    .filter(Boolean) as TopicGroupForNav[]

  return topicGroups
}
