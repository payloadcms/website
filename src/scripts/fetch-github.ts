/* eslint-disable no-underscore-dangle */
import fetch from 'node-fetch'
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

  const discussionData = []

  /* eslint-disable-next-line @typescript-eslint/default-param-last */
  const createQuery = (cursor = null, hasNextPage: boolean): string => {
    const queryLine =
      cursor && hasNextPage
        ? `(first: 100, categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMzY4NTUw", after: "${cursor}")`
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

  const initialReq = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      // @ts-expect-error
      query: createQuery(),
    }),
  }).then(res => res.json())

  discussionData.push(...initialReq.data.repository.discussions.nodes)
  let hasNextPage = initialReq.data.repository.discussions.pageInfo.hasNextPage
  let cursor = initialReq.data.repository.discussions.pageInfo.endCursor

  while (hasNextPage) {
    const nextReq = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: createQuery(cursor, hasNextPage),
      }),
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
        createdAt: answer.createdAt,
        chosenAt: answerChosenAt,
        chosenBy: answerChosenBy?.login,
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
        title: discussion.title,
        body: discussion.bodyHTML,
        url: discussion.url,
        id: String(discussion.number),
        slug: sanitizeSlug(discussion.title),
        createdAt: discussion.createdAt,
        upvotes: discussion.upvoteCount,
        commentTotal: discussion.comments.totalCount,
        author: {
          name: discussion.author?.login,
          avatar: discussion.author?.avatarUrl,
          url: discussion.author?.url,
        },
        comments,
        answer: formattedAnswer,
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
          where: { githubID: { equals: discussion.id } },
          limit: 1,
          depth: 0,
        })

        const discussionExists = // @ts-expect-error
          existingDiscussion.docs[0]?.communityHelpJSON?.id === discussion?.id

        if (discussionExists) {
          await payload.update({
            collection: 'community-help',
            id: existingDiscussion.docs[0]?.id,
            data: {
              communityHelpJSON: discussion,
            },
            depth: 0,
          })
        } else {
          await payload.create({
            collection: 'community-help',
            data: {
              title: discussion?.title,
              communityHelpType: 'github',
              githubID: discussion?.id,
              communityHelpJSON: discussion,
              slug: discussion?.slug,
            },
          })
        }
      }
    }),
  )
}
