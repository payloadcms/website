/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
import dotenv from 'dotenv'
import fs from 'fs'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import remarkGfm from 'remark-gfm'

import { topicOrder } from './shared.mjs'

dotenv.config()

const __dirname = path.resolve()

const decodeBase64 = string => {
  const buff = Buffer.from(string, 'base64')
  return buff.toString('utf8')
}

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

const githubAPI = 'https://api.github.com/repos/payloadcms/payload'

const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

async function getHeadings(source) {
  const headingLines = source.split('\n').filter(line => {
    return line.match(/^#{1,3}\s.+/gm)
  })

  return headingLines.map(raw => {
    const text = raw.replace(/^###*\s/, '')
    const level = raw.slice(0, 3) === '###' ? 3 : 2
    return { text, level, id: slugify(text) }
  })
}

const fetchDocs = async () => {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    console.log('No GitHub access token found - skipping docs retrieval') // eslint-disable-line no-console
    process.exit(0)
  }

  let ref
  let outputDirectory = './src/app/docs.json'

  process.argv.forEach((val, index) => {
    if (val === '--ref') {
      ref = process.argv[index + 1]
    }

    if (val === '--output') {
      outputDirectory = process.argv[index + 1]
    }
  })

  if (!ref) {
    const latest = await fetch(`${githubAPI}/releases/latest`, {
      headers,
    }).then(res => res.json())

    ref = latest.tag_name
  }

  const topics = await Promise.all(
    topicOrder.map(async unsanitizedTopicSlug => {
      const topicSlug = unsanitizedTopicSlug.toLowerCase()

      try {
        const docs = await fetch(`${githubAPI}/contents/docs/${topicSlug}?ref=${ref}`, {
          headers,
        }).then(res => res.json())

        if (docs && Array.isArray(docs)) {
          const docFilenames = docs.map(({ name }) => name)

          const parsedDocs = await Promise.all(
            docFilenames.map(async docFilename => {
              try {
                const json = await fetch(
                  `${githubAPI}/contents/docs/${topicSlug}/${docFilename}?ref=${ref}`,
                  {
                    headers,
                  },
                ).then(res => res.json())

                const parsedDoc = matter(decodeBase64(json.content))

                const doc = {
                  content: await serialize(parsedDoc.content, {
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }),
                  title: parsedDoc.data.title,
                  slug: docFilename.replace('.mdx', ''),
                  label: parsedDoc.data.label,
                  order: parsedDoc.data.order,
                  desc: parsedDoc.data.desc || '',
                  keywords: parsedDoc.data.keywords || '',
                  headings: await getHeadings(parsedDoc.content),
                }

                return doc
              } catch (err) {
                const msg = err instanceof Error ? err.message : err || 'Unknown error'
                console.error(`Error fetching ${docFilename}: ${msg}`) // eslint-disable-line no-console
              }
            }),
          )

          const topic = {
            slug: unsanitizedTopicSlug,
            docs: parsedDocs.filter(Boolean).sort((a, b) => a.order - b.order),
          }

          return topic
        } else {
          if (docs && typeof docs === 'object' && 'message' in docs) {
            console.error(`Error fetching ${topicSlug} doc: ${docs.message}`) // eslint-disable-line no-console
          }
        }
      } catch (err) {
        console.error(err) // eslint-disable-line no-console
      }

      return null
    }),
  )

  const data = JSON.stringify(topics, null, 2)

  const docsFilename = path.resolve(__dirname, outputDirectory)

  fs.writeFile(docsFilename, data, err => {
    if (err) {
      console.error(err) // eslint-disable-line no-console
    } else {
      console.log(`Docs successfully written to ${docsFilename}`) // eslint-disable-line no-console
    }
    process.exit(0)
  })
}

fetchDocs()
