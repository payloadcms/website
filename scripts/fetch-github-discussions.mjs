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
    console.log('No GitHub access token found - skipping docs retrieval')
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
            edges {
              node {
                title
                url
              }
            }
          }
        }
      }
      `,
    }),
  }).then(res => res.json())

  const data = JSON.stringify(discussions)

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
