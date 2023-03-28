/* eslint-disable no-underscore-dangle */
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

dotenv.config()

const __dirname = path.resolve()

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const headers = {
  Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
}

const fetchGithubDiscussions = async () => {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    console.log('No GitHub access token found - skipping discussions retrieval')
    process.exit(0)
  }

  const discussionData = []

  const createQuery = (cursor = null, hasNextPage) => {
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
        slug: slugify(discussion.title),
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

  const data = JSON.stringify(filteredDiscussions, null, 2)

  const filePath = path.resolve(__dirname, './discussions.json')

  fs.writeFile(filePath, data, err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`GitHub discussions successfully output to ${filePath}`)
    }
    process.exit(0)
  })
}

fetchGithubDiscussions()
