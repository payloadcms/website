import { qs } from '@root/utilities/qs'
import { cookies } from 'next/headers'

import sanitizeSlug from '../utilities/sanitizeSlug'

const { GITHUB_ACCESS_TOKEN, NEXT_PUBLIC_CMS_URL } = process.env
const headers = {
  Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
}

async function fetchGitHub(): Promise<void> {
  if (!GITHUB_ACCESS_TOKEN) {
    console.log('No GitHub access token found - skipping discussions retrieval')
    process.exit(0)
  }

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

  discussionData.push(...initialReq.data.repository.discussions.nodes)
  let hasNextPage = initialReq.data.repository.discussions.pageInfo.hasNextPage
  let cursor = initialReq.data.repository.discussions.pageInfo.endCursor

  while (hasNextPage) {
    const nextReq = await fetch('https://api.github.com/graphql', {
      body: JSON.stringify({
        query: createQuery(cursor, hasNextPage),
      }),
      headers,
      method: 'POST',
    }).then((res) => res.json())

    discussionData.push(...nextReq.data.repository.discussions.nodes)

    hasNextPage = nextReq.data.repository.discussions.pageInfo.hasNextPage
    cursor = nextReq.data.repository.discussions.pageInfo.endCursor
  }

  console.log(`Retrieved ${discussionData.length} discussions from GitHub`)
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
  const existingDiscussionIDs = await fetch(
    `${NEXT_PUBLIC_CMS_URL}/api/community-help?depth=0&where[communityHelpType][equals]=github&limit=0`,
  )
    .then((res) => res.json())
    .then((data) => data.docs.map((thread) => thread.githubID))

  const populateAll = filteredDiscussions.map(async (discussion) => {
    if (!discussion) {
      return
    }

    const discussionExists = existingDiscussionIDs.includes(discussion.id)
    const body = JSON.stringify({
      slug: discussion.slug,
      communityHelpJSON: discussion,
      communityHelpType: 'github',
      githubID: discussion.id,
      title: discussion.title,
    })

    const endpoint = discussionExists
      ? `${NEXT_PUBLIC_CMS_URL}/api/community-help?${qs.stringify({
          depth: 0,
          where: { githubID: { equals: discussion.id } },
        })}`
      : `${NEXT_PUBLIC_CMS_URL}/api/community-help`

    const method = discussionExists ? 'PATCH' : 'POST'

    await fetch(endpoint, {
      body,
      headers: {
        Authorization: `JWT ${token.value}`,
        'Content-Type': 'application/json',
      },
      method,
    })
  })

  await Promise.all(populateAll)
}

export default fetchGitHub
