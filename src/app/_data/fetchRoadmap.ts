import type { RoadmapItem, RoadmapPriority } from '../../components/blocks/RoadmapBlock/types'

const { GITHUB_ACCESS_TOKEN } = process.env

const headers = {
  Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
}

type GitHubDiscussion = {
  bodyHTML: string
  comments: {
    totalCount: number
  }
  createdAt: string
  labels: {
    nodes: Array<{
      name: string
    }>
  }
  number: number
  title: string
  upvoteCount: number
  url: string
}

type GitHubResponse = {
  data: {
    repository: {
      discussions: {
        nodes: GitHubDiscussion[]
        pageInfo: {
          endCursor: null | string
          hasNextPage: boolean
        }
      }
    }
  }
  errors?: { message: string; type: string }[]
}

const buildQuery = (
  cursor: null | string = null,
): { query: string; variables: Record<string, unknown> } => ({
  query: `query FetchDiscussions($cursor: String) {
    repository(owner: "payloadcms", name: "payload") {
      discussions(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          title
          bodyHTML
          url
          number
          createdAt
          upvoteCount
          comments {
            totalCount
          }
          labels(first: 10) {
            nodes {
              name
            }
          }
        }
      }
    }
  }`,
  variables: { cursor },
})

const extractPriority = (labels: Array<{ name: string }>): RoadmapPriority => {
  const priorityLabel = labels.find((label) => label.name.toLowerCase().startsWith('roadmap:'))

  if (!priorityLabel) {
    return 'TBD'
  }

  const priority = priorityLabel.name.toLowerCase().replace('roadmap:', '').trim()

  if (priority === 'p0') {
    return 'P0'
  }
  if (priority === 'p1') {
    return 'P1'
  }
  if (priority === 'p2') {
    return 'P2'
  }
  return 'TBD'
}

const fetchRoadmapDiscussions = async (): Promise<GitHubDiscussion[]> => {
  if (!GITHUB_ACCESS_TOKEN) {
    console.warn('[fetchRoadmap] No GitHub access token found - returning empty roadmap')
    return []
  }

  const discussions: GitHubDiscussion[] = []
  let hasNextPage = true
  let cursor: null | string = null

  try {
    while (hasNextPage) {
      const response = await fetch('https://api.github.com/graphql', {
        body: JSON.stringify(buildQuery(cursor)),
        headers,
        method: 'POST',
        next: { revalidate: 3600 },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`)
      }

      const result: GitHubResponse = await response.json()

      if (result.errors?.length) {
        console.error('[fetchRoadmap] GitHub GraphQL errors:', JSON.stringify(result.errors))
        break
      }

      if (!result.data?.repository?.discussions) {
        console.error('[fetchRoadmap] Unexpected response shape:', JSON.stringify(result))
        break
      }

      const { nodes, pageInfo } = result.data.repository.discussions

      discussions.push(...nodes)
      hasNextPage = pageInfo.hasNextPage
      cursor = pageInfo.endCursor
    }
  } catch (error) {
    console.error('[fetchRoadmap] Error fetching roadmap discussions:', error)
  }

  return discussions
}

export const fetchRoadmap = async (): Promise<{
  P0: RoadmapItem[]
  P1: RoadmapItem[]
  P2: RoadmapItem[]
}> => {
  const discussions = await fetchRoadmapDiscussions()

  const roadmapItems: RoadmapItem[] = discussions
    .filter((discussion) =>
      discussion.labels.nodes.some((label) => label.name.toLowerCase().startsWith('roadmap:')),
    )
    .map((discussion) => ({
      commentCount: discussion.comments.totalCount,
      createdAt: discussion.createdAt,
      description: discussion.bodyHTML,
      number: discussion.number,
      priority: extractPriority(discussion.labels.nodes),
      title: discussion.title,
      upvoteCount: discussion.upvoteCount,
      url: discussion.url,
    }))
    .filter((item) => item.priority !== 'TBD')

  return {
    P0: roadmapItems.filter((item) => item.priority === 'P0'),
    P1: roadmapItems.filter((item) => item.priority === 'P1'),
    P2: roadmapItems.filter((item) => item.priority === 'P2'),
  }
}
