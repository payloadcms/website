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
          discussions(first: 100) {
            totalCount,
            nodes {
              title
              bodyHTML
              url
              number
              createdAt
              upvoteCount,

              author {
                login
                avatarUrl
                url
              }
              comments(first: 10) {
                totalCount,
                edges {
                  node {
                    author {
                      login
                      avatarUrl
                      url
                    }
                    body
                    createdAt
                  }
                }
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
      const comments = discussion.comments.edges.map(edge => {
        return {
          author: {
            name: edge.node.author.login,
            avatar: edge.node.author.avatarUrl,
            url: edge.node.author.url,
          },
          body: edge.node.body,
          createdAt: edge.node.createdAt,
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
          name: discussion.author.login,
          avatar: discussion.author.avatarUrl,
          url: discussion.author.url,
        },
        comments,
      }
    })

    const data = JSON.stringify(formattedDiscussions, null, 2)

    const filePath = path.resolve(__dirname, './src/app/community-help/github/discussions.json')

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
