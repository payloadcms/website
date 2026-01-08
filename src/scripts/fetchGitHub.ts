import { cookies } from 'next/headers'

import sanitizeSlug from '../utilities/sanitizeSlug'

const { GITHUB_ACCESS_TOKEN, NEXT_PUBLIC_CMS_URL } = process.env
const headers = {
  Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
}

type ExistingDiscussion = {
  docId: string
  githubID: string
}

async function fetchGitHub(): Promise<void> {
  if (!GITHUB_ACCESS_TOKEN) {
    console.log('[fetchGitHub] No GitHub access token found - skipping discussions retrieval')
    return
  }

  console.time('[fetchGitHub] Total duration')
  console.log('[fetchGitHub] Starting GitHub discussions sync...')

  const discussionData: any = []

  const createQuery = (cursor = null, hasNextPage: boolean): string => {
    const queryLine =
      cursor && hasNextPage
        ? `(first: 100, categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMzY4NTUw", after: "${
            cursor as string
          }")`
        : `(first: 100, categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMzY4NTUw")`

    return `query {
      repository(owner:"payloadcms", name:"payload") {
        discussions${queryLine} {
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
            upvoteCount,
            category {
              isAnswerable
              id
            }
            author {
              login
              avatarUrl
              url
            }
            comments(first: 30) {
              totalCount,
              edges {
                node {
                  author {
                    login
                    avatarUrl
                    url
                  }
                  bodyHTML
                  createdAt
                  replies(first: 30) {
                    edges {
                      node {
                        author {
                          login
                          avatarUrl
                          url
                        }
                        bodyHTML
                        createdAt
                      }
                    }
                  }
                }
              }
            }
            answer {
              author {
                login
                avatarUrl
                url
              }
              bodyHTML
              createdAt
              replies(first: 30) {
                edges {
                  node {
                    author {
                      login
                      avatarUrl
                      url
                    }
                    bodyHTML
                    createdAt
                  }
                }
              }
            }
            answerChosenAt
            answerChosenBy {
              login
            }
          }
        }
      }
    }`
  }

  const initialReq: any = await fetch('https://api.github.com/graphql', {
    body: JSON.stringify({
      query: createQuery(null, false),
    }),
    headers,
    method: 'POST',
  }).then((res) => res.json())

  if (initialReq.errors) {
    console.error('[fetchGitHub] GitHub API returned errors:', JSON.stringify(initialReq.errors))
    throw new Error(`GitHub API error: ${initialReq.errors[0]?.message || 'Unknown error'}`)
  }

  if (!initialReq.data?.repository?.discussions) {
    console.error('[fetchGitHub] Unexpected GitHub API response:', JSON.stringify(initialReq))
    throw new Error('GitHub API returned unexpected response structure')
  }

  discussionData.push(...initialReq.data.repository.discussions.nodes)
  let hasNextPage = initialReq.data.repository.discussions.pageInfo.hasNextPage
  let cursor = initialReq.data.repository.discussions.pageInfo.endCursor

  while (hasNextPage) {
    let nextReq
    const retries = 3
    let success = false

    // Retry logic for timeouts
    for (let attempt = 0; attempt <= retries && !success; attempt++) {
      try {
        nextReq = await fetch('https://api.github.com/graphql', {
          body: JSON.stringify({
            query: createQuery(cursor, hasNextPage),
          }),
          headers,
          method: 'POST',
        }).then((res) => res.json())

        // Check for timeout or service errors in the response
        if (nextReq.message && nextReq.message.includes("couldn't respond")) {
          if (attempt < retries) {
            console.warn(
              `[fetchGitHub] GitHub API timeout, retrying in 3s (attempt ${attempt + 1}/${retries + 1})`,
            )
            await new Promise((resolve) => setTimeout(resolve, 3000))
            continue
          } else {
            console.error('[fetchGitHub] GitHub API timeout after retries:', nextReq.message)
            throw new Error(`GitHub API timeout: ${nextReq.message}`)
          }
        }

        if (nextReq.errors) {
          console.error('[fetchGitHub] GitHub API returned errors:', JSON.stringify(nextReq.errors))
          throw new Error(`GitHub API error: ${nextReq.errors[0]?.message || 'Unknown error'}`)
        }

        if (!nextReq.data?.repository?.discussions) {
          console.error('[fetchGitHub] Unexpected GitHub API response:', JSON.stringify(nextReq))
          throw new Error('GitHub API returned unexpected response structure')
        }

        success = true
      } catch (error) {
        if (attempt < retries) {
          console.warn(
            `[fetchGitHub] Error fetching discussions page, retrying (attempt ${attempt + 1}/${retries + 1}):`,
            error.message,
          )
          await new Promise((resolve) => setTimeout(resolve, 3000))
        } else {
          throw error
        }
      }
    }

    if (!success || !nextReq) {
      throw new Error('Failed to fetch GitHub discussions after retries')
    }

    discussionData.push(...nextReq.data.repository.discussions.nodes)

    hasNextPage = nextReq.data.repository.discussions.pageInfo.hasNextPage
    cursor = nextReq.data.repository.discussions.pageInfo.endCursor
  }

  console.log(`[fetchGitHub] Retrieved ${discussionData.length} discussions from GitHub`)
  const formattedDiscussions = discussionData.map((discussion) => {
    const { answer, answerChosenAt, answerChosenBy, category } = discussion

    if (answer !== null && category.isAnswerable) {
      const answerReplies = answer?.replies.edges.map((replyEdge) => {
        const reply = replyEdge.node

        return {
          author: {
            name: reply.author.login,
            avatar: reply.author.avatarUrl,
            url: reply.author.url,
          },
          body: reply.bodyHTML,
          createdAt: reply.createdAt,
        }
      })

      const formattedAnswer = {
        author: {
          name: answer.author?.login,
          avatar: answer.author?.avatarUrl,
          url: answer.author?.url,
        },
        body: answer.bodyHTML,
        chosenAt: answerChosenAt,
        chosenBy: answerChosenBy?.login,
        createdAt: answer.createdAt,
        replies: answerReplies?.length > 0 ? answerReplies : null,
      }
      const comments = discussion.comments.edges.map((edge) => {
        const comment = edge.node

        const replies = comment.replies.edges.map((replyEdge) => {
          const reply = replyEdge.node

          return {
            author: {
              name: reply.author.login,
              avatar: reply.author.avatarUrl,
              url: reply.author.url,
            },
            body: reply.bodyHTML,
            createdAt: reply.createdAt,
          }
        })

        return {
          author: {
            name: comment.author.login,
            avatar: comment.author.avatarUrl,
            url: comment.author.url,
          },
          body: comment.bodyHTML,
          createdAt: comment.createdAt,
          replies: replies?.length ? replies : null,
        }
      })

      return {
        id: String(discussion.number),
        slug: sanitizeSlug(discussion.title),
        answer: formattedAnswer,
        author: {
          name: discussion.author?.login,
          avatar: discussion.author?.avatarUrl,
          url: discussion.author?.url,
        },
        body: discussion.bodyHTML,
        comments,
        commentTotal: discussion.comments.totalCount,
        createdAt: discussion.createdAt,
        title: discussion.title,
        upvotes: discussion.upvoteCount,
        url: discussion.url,
      }
    }
    return null
  })

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')

  if (!token) {
    throw new Error('You are unauthorized, please log in.')
  }

  const filteredDiscussions = formattedDiscussions.filter((discussion) => discussion !== null)

  console.log('[fetchGitHub] Fetching existing GitHub discussions from CMS...')
  const existingDiscussions: ExistingDiscussion[] = await fetch(
    `${NEXT_PUBLIC_CMS_URL}/api/community-help?depth=0&where[communityHelpType][equals]=github&limit=0`,
  )
    .then((res) => res.json())
    .then((data) =>
      data.docs.map((thread) => ({
        docId: thread.id,
        githubID: thread.githubID,
      })),
    )

  console.log(
    `[fetchGitHub] Found ${existingDiscussions.length} existing discussions in CMS, ${filteredDiscussions.length} to process`,
  )

  const populateAll = filteredDiscussions.map(async (discussion) => {
    if (!discussion) {
      return
    }

    const existingDiscussion = existingDiscussions.find((d) => d.githubID === discussion.id)
    const body = JSON.stringify({
      slug: discussion.slug,
      communityHelpJSON: discussion,
      communityHelpType: 'github',
      githubID: discussion.id,
      threadCreatedAt: discussion.createdAt,
      title: discussion.title,
    })

    const endpoint = existingDiscussion
      ? `${NEXT_PUBLIC_CMS_URL}/api/community-help/${existingDiscussion.docId}`
      : `${NEXT_PUBLIC_CMS_URL}/api/community-help`

    const method = existingDiscussion ? 'PATCH' : 'POST'

    try {
      const response = await fetch(endpoint, {
        body,
        headers: {
          Authorization: `JWT ${token.value}`,
          'Content-Type': 'application/json',
        },
        method,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          `[fetchGitHub] ${method} failed for discussion "${discussion.title}" (#${discussion.id}): ${response.status} ${response.statusText}`,
        )
        console.error(`[fetchGitHub] Response body: ${errorText}`)
      } else {
        const action = method === 'POST' ? 'created' : 'updated'
        console.log(
          `[fetchGitHub] Successfully ${action} discussion "${discussion.title}" (#${discussion.id})`,
        )
      }
    } catch (error) {
      console.error(
        `[fetchGitHub] Exception processing discussion "${discussion.title}" (#${discussion.id}):`,
        error,
      )
    }
  })

  await Promise.all(populateAll)
  console.log('[fetchGitHub] Sync completed!')
  console.timeEnd('[fetchGitHub] Total duration')
}

export default fetchGitHub
