/* eslint-disable no-underscore-dangle */
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

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

  const discussions = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: `
      query {
        repository(owner:"payloadcms", name:"payload") {
          discussions(first: 100, categoryId: "MDE4OkRpc2N1c3Npb25DYXRlZ29yeTMyMzY4NTUw") {
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
              }
              answerChosenAt
              answerChosenBy {
                login
              }
            }
          }
        }
      }
      `,
    }),
  }).then(res => res.json())

  if (discussions.errors) {
    console.log(`Error: ${discussions.errors.map(error => error.message).join(', ')}`)
    process.exit(1)
  } else {
    const formattedDiscussions = discussions.data.repository.discussions.nodes.map(discussion => {
      const { answer, answerChosenAt, answerChosenBy, category } = discussion

      if (answer !== null && category.isAnswerable) {
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
}

fetchGithubDiscussions()
