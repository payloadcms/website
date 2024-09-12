/* eslint-disable no-underscore-dangle */
import type { Payload } from 'payload'

import sanitizeSlug from '../utilities/sanitizeSlug'

// eslint-disable-next-line
require('dotenv').config()

const headers = {
  Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
}

export async function fetchGithubDiscussions(payload: Payload): Promise<void> {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    /* eslint-disable no-console */
    console.log('No GitHub access token found - skipping discussions retrieval')
    process.exit(0)
  }

  const discussionData: any = []

  /* eslint-disable-next-line @typescript-eslint/default-param-last */
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
      // @ts-expect-error
      query: createQuery(),
    }),
    headers,
    method: 'POST',
  }).then(res => res.json())

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
    }).then(res => res.json())

    discussionData.push(...nextReq.data.repository.discussions.nodes)

    hasNextPage = nextReq.data.repository.discussions.pageInfo.hasNextPage
    cursor = nextReq.data.repository.discussions.pageInfo.endCursor
  }

  console.log(`Retrieved ${discussionData.length} discussions from GitHub`)
  const formattedDiscussions = discussionData.map(discussion => {
    const { answer, answerChosenAt, answerChosenBy, category } = discussion

    if (answer !== null && category.isAnswerable) {
      const answerReplies = answer?.replies.edges.map(replyEdge => {
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
      const comments = discussion.comments.edges.map(edge => {
        const comment = edge.node

        const replies = comment.replies.edges.map(replyEdge => {
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
        commentTotal: discussion.comments.totalCount,
        comments,
        createdAt: discussion.createdAt,
        title: discussion.title,
        upvotes: discussion.upvoteCount,
        url: discussion.url,
      }
    }
    return null
  })

  const filteredDiscussions = formattedDiscussions.filter(discussion => discussion !== null)

  await Promise.all(
    filteredDiscussions.map(async discussion => {
      if (discussion) {
        // Check if discussion exists, if it does update existing discussion else add discussion to collection
        const existingDiscussion = await payload.find({
          collection: 'community-help',
          depth: 0,
          limit: 1,
          where: { githubID: { equals: discussion.id } },
        })

        const discussionExists = // @ts-expect-error
          existingDiscussion.docs[0]?.communityHelpJSON?.id === discussion?.id

        if (discussionExists) {
          await payload.update({
            id: existingDiscussion.docs[0]?.id,
            collection: 'community-help',
            data: {
              communityHelpJSON: discussion,
            },
            depth: 0,
          })
        } else {
          await payload.create({
            collection: 'community-help',
            data: {
              slug: discussion?.slug,
              communityHelpJSON: discussion,
              communityHelpType: 'github',
              githubID: discussion?.id,
              title: discussion?.title,
            },
          })
        }
      }
    }),
  )
}
