/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { topicOrder } from './shared.mjs'



const __dirname = path.resolve()

const docsDirectory = process.env.DOCS_DIR
  ? path.resolve(process.env.DOCS_DIR)
  : path.join(process.cwd(), './node_modules/payload/docs')

console.log(`Fetching docs from: ${docsDirectory}`)

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
  const topics = await Promise.all(
    topicOrder.map(async unsanitizedTopicSlug => {
      const topicSlug = unsanitizedTopicSlug.toLowerCase()

      const topicDirectory = path.join(docsDirectory, `./${topicSlug}`)
      const docSlugs = fs.readdirSync(topicDirectory)

      const parsedDocs = await Promise.all(
        docSlugs.map(async docFilename => {
          try {
            const rawDoc = fs.readFileSync(
              `${docsDirectory}/${topicSlug.toLowerCase()}/${docFilename}`,
              'utf8',
            )

            const parsedDoc = matter(rawDoc)

            const doc = {
              content: parsedDoc.content,
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
    }),
  )

  const data = JSON.stringify(topics, null, 2)

  const docsFilename = path.resolve(__dirname, './src/app/docs.json')

  fs.writeFile(docsFilename, data, err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`Docs successfully written to ${docsFilename}`)
    }
    process.exit(0)
  })
}

fetchDocs()
