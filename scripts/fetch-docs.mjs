/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import dotenv from 'dotenv'
/* eslint-disable no-useless-escape */
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { topicOrder } from './shared.mjs'

dotenv.config()

const __dirname = path.resolve()

const githubAPI = 'https://api.github.com/repos/payloadcms/payload'
const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

let ref
let outputDirectory = './src/docs/docs.json'
let source = 'local'
let version = 'v3'

const decodeBase64 = (string) => {
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
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/-{2,}/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

function getHeadings(source) {
  let insideCodeBlock = false
  const headingLines = source.split('\n').filter((line) => {
    if (line.match(/^```/)) insideCodeBlock = !insideCodeBlock
    if (insideCodeBlock) return false
    return line.match(/^#{1,3}\s.+/gm)
  })

  return headingLines.map((raw) => {
    const textWithAnchor = raw.replace(/^#{2,}\s/, '') // Remove heading hashes
    const [text, customAnchor] = textWithAnchor.split('#') // Split by '#'
    const level = raw.startsWith('###') ? 3 : 2
    const anchor = slugify(customAnchor ? customAnchor.trim() : text.trim())
    return { id: anchor, level, text: text.trim(), anchor }
  })
}

function getLocalDocsPath() {
  const nodeModuleDocsPath = path.join(process.cwd(), './node_modules/payload/docs')
  const docDirs = {
    v2: process.env.DOCS_DIR_V2 ? path.resolve(process.env.DOCS_DIR_V2) : nodeModuleDocsPath,
    v3: process.env.DOCS_DIR_V3 ? path.resolve(process.env.DOCS_DIR_V3) : nodeModuleDocsPath,
  }
  return docDirs?.[ref] || nodeModuleDocsPath
}

async function getFilenames({ topicSlug }) {
  if (source === 'github') {
    try {
      const docs = await fetch(`${githubAPI}/contents/docs/${topicSlug}?ref=${ref}`, {
        headers,
      }).then((res) => res.json())

      if (docs && Array.isArray(docs)) {
        return docs.map((doc) => doc.name)
      } else if (docs && typeof docs === 'object' && 'message' in docs) {
        console.error(`Error fetching ${topicSlug} for ref: ${ref}. Reason: ${docs.message}`) // eslint-disable-line no-console
      }
      return []
    } catch (e) {
      return []
    }
  } else {
    const filePath = path.join(getLocalDocsPath(), `./${topicSlug}`)
    if (!fs.existsSync(filePath)) {
      return []
    }
    return fs.readdirSync(filePath)
  }
}

async function getDocMatter({ docFilename, topicSlug }) {
  if (source === 'github') {
    const json = await fetch(`${githubAPI}/contents/docs/${topicSlug}/${docFilename}?ref=${ref}`, {
      headers,
    }).then((res) => res.json())
    const parsedDoc = matter(decodeBase64(json.content))
    parsedDoc.content = parsedDoc.content
      .replace(/\(\/docs\//g, '(../')
      .replace(/"\/docs\//g, '"../')
      .replace(/https:\/\/payloadcms.com\/docs\//g, '../')
    return parsedDoc
  } else {
    const rawDoc = fs.readFileSync(`${getLocalDocsPath()}/${topicSlug}/${docFilename}`, 'utf8')
    if (rawDoc) {
      return matter(rawDoc)
    }
    return null
  }
}

async function fetchDocs() {
  process.argv.forEach((val, index) => {
    if (val === '--ref') {
      ref = process.argv[index + 1]
    }

    if (val === '--output') {
      outputDirectory = process.argv[index + 1]
    }

    if (val === '--source') {
      const nextArg = process.argv[index + 1]
      if (nextArg === 'github' || nextArg === 'local') {
        source = nextArg
      } else {
        console.error('Invalid source. Must be "github" or "local"')
        process.exit(1)
      }
    }

    if (val === '--v') {
      version = process.argv[index + 1]
    }
  })

  const topics = await Promise.all(
    topicOrder[version].map(
      async ({ topics: topicsGroup, groupLabel }) => ({
        groupLabel,
        topics: await Promise.all(
          topicsGroup.map(async (key) => {
            const topicSlug = key.toLowerCase()
            const filenames = await getFilenames({ topicSlug })

            if (filenames.length === 0) return null

            const parsedDocs = await Promise.all(
              filenames.map(async (docFilename) => {
                const docMatter = await getDocMatter({ docFilename, topicSlug })

                if (!docMatter) return null

                return {
                  slug: docFilename.replace('.mdx', ''),
                  content: docMatter.content,
                  desc: docMatter.data.desc || docMatter.data.description || '',
                  headings: await getHeadings(docMatter.content),
                  keywords: docMatter.data.keywords || '',
                  label: docMatter.data.label,
                  order: docMatter.data.order,
                  title: docMatter.data.title,
                }
              }),
            )

            return {
              slug: key,
              docs: parsedDocs.filter(Boolean).sort((a, b) => a.order - b.order),
            }
          }),
        ),
      }),
      [],
    ),
  )

  const data = JSON.stringify(topics.filter(Boolean), null, 2)
  const docsFilename = path.resolve(__dirname, outputDirectory)

  const dir = path.dirname(docsFilename)
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFile(docsFilename, data, (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log(`Docs successfully written to ${docsFilename}`)
    }
    process.exit(0)
  })
}

void fetchDocs()
