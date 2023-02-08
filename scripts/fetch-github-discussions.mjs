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
          discussions(first: 10) {
            totalCount,
            nodes {
              title
              bodyHTML
              url
              id
              createdAt
              author {
                login
              }
              comments(first: 10) {
                edges {
                  node {
                    author {
                      login
                    }
                    body
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
      const slug = slugify(discussion.title)
      const comments = discussion.comments.edges.map(edge => {
        return {
          author: edge.node.author.login,
          body: edge.node.body,
        }
      })

      return {
        slug,
        title: discussion.title,
        body: discussion.bodyHTML,
        url: discussion.url,
        id: discussion.id,
        createdAt: discussion.createdAt,
        author: discussion.author.login,
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
