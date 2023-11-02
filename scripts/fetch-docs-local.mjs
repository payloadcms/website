/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
import dotenv from 'dotenv'
import fs from 'fs'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'
import remarkGfm from 'remark-gfm'

dotenv.config()

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

const topicOrder = [
  'Getting-Started',
  'Configuration',
  'Database',
  'Fields',
  'Admin',
  'Rich-Text',
  'Live-Preview',
  'Access-Control',
  'Hooks',
  'Authentication',
  'Versions',
  'Upload',
  'GraphQL',
  'REST-API',
  'Local-API',
  'Queries',
  'Production',
  'Email',
  'TypeScript',
  'Plugins',
  'Integrations',
  'Cloud',
]

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

export async function parseDocs(fileNames, topicSlugs, topicDirectory) {
  const parsedDocs = await Promise.all(
    fileNames.map(async docFilename => {
      try {
        const path = `${topicDirectory}/${docFilename}`

        if(fs.lstatSync(path).isDirectory()) {
          const subDocSlugs = fs.readdirSync(path)

          const subDocs = await parseDocs(
            subDocSlugs,
            topicSlugs.concat(docFilename),
            path
          )
          const subTopic = {
            slug: docFilename,
            path: topicSlugs.concat(docFilename).join('/')+'/',
            docs: subDocs.filter(Boolean).sort((a, b) => a.order - b.order),
          }
          return subTopic
        } else {
          const rawDoc = fs.readFileSync(
            path,
            'utf8',
          )

          const parsedDoc = matter(rawDoc)

          const doc = {
            content: await serialize(parsedDoc.content, {
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }),
            title: parsedDoc.data.title,
            slug: docFilename.replace('.mdx', ''),
            path: topicSlugs.join('/')+'/',
            label: parsedDoc.data.label,
            order: parsedDoc.data.order,
            desc: parsedDoc.data.desc || '',
            keywords: parsedDoc.data.keywords || '',
            headings: await getHeadings(parsedDoc.content),
          }

          return doc
        }

      } catch (error) {
        const msg = error instanceof Error ? error.message : error || 'Unknown error'
        console.error(`Error fetching ${docFilename}: ${msg}`) // eslint-disable-line no-console
      }
    }),
  )
  return parsedDocs
}

const fetchDocs = async () => {
  const topics = await Promise.all(
    topicOrder.map(async unsanitizedTopicSlug => {
      const topicSlug = unsanitizedTopicSlug.toLowerCase()

      const topicDirectory = path.join(docsDirectory, `./${topicSlug}`)
      const docSlugs = fs.readdirSync(topicDirectory)

      const parsedDocs = await parseDocs(docSlugs, [topicSlug], `${docsDirectory}/${topicSlug}`)

      const topic = {
        slug: unsanitizedTopicSlug,
        path: '/',
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
