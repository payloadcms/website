/* eslint-disable no-console */

import type {
  GithubAPIResponse,
  Heading,
  ParsedDoc,
  Topic,
  TopicGroup,
} from '@root/collections/Docs/types'

/* eslint-disable no-useless-escape */
import { topicOrder } from '@root/collections/Docs/topicOrder'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const githubAPI = 'https://api.github.com/repos/payloadcms/payload'
const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

let ref: ('2.x' | 'main') | ({} & string)
let source: 'github' | 'local' = 'local'
let version: ('v2' | 'v3') | ({} & string) = 'v3'

const decodeBase64 = (string: string) => {
  const buff = Buffer.from(string, 'base64')
  return buff.toString('utf8')
}

function slugify(string: string): string {
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

function getHeadings(source: string): Heading[] {
  let insideCodeBlock = false
  const headingLines = source.split('\n').filter((line) => {
    if (line.match(/^```/)) {
      insideCodeBlock = !insideCodeBlock
    }
    if (insideCodeBlock) {
      return false
    }
    return line.match(/^#{1,3}\s.+/gm)
  })

  return headingLines.map((raw) => {
    const textWithAnchor = raw.replace(/^#{2,}\s/, '') // Remove heading hashes
    const [text, customAnchor] = textWithAnchor.split('#') // Split by '#'
    const level = raw.startsWith('###') ? 3 : 2
    const anchor = slugify(customAnchor ? customAnchor.trim() : text.trim())
    return { id: anchor, anchor, level, text: text.trim() }
  })
}

function getLocalDocsPath(): string {
  const nodeModuleDocsPath = path.join(process.cwd(), './node_modules/payload/docs')
  const docDirs = {
    v2: process.env.DOCS_DIR_V2 ? path.resolve(process.env.DOCS_DIR_V2) : nodeModuleDocsPath,
    v3: process.env.DOCS_DIR_V3 ? path.resolve(process.env.DOCS_DIR_V3) : nodeModuleDocsPath,
  }
  return docDirs?.[ref] || nodeModuleDocsPath
}

async function getFilenames({ topicSlug }): Promise<string[]> {
  if (source === 'github') {
    try {
      const docs = await fetch(`${githubAPI}/contents/docs/${topicSlug}?ref=${ref}`, {
        headers,
      }).then((res) => res.json())

      if (docs && Array.isArray(docs)) {
        return docs.map((doc) => doc.name)
      } else if (docs && typeof docs === 'object' && 'message' in docs) {
        console.error(`Error fetching ${topicSlug} for ref: ${ref}. Reason: ${docs.message}`)
      }
      return []
    } catch (_e) {
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
    const json: GithubAPIResponse = await fetch(
      `${githubAPI}/contents/docs/${topicSlug}/${docFilename}?ref=${ref}`,
      {
        headers,
      },
    ).then((res) => res.json())

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

export async function fetchDocs(args?: {
  ref?: typeof ref
  source?: typeof source
  version?: typeof version
}): Promise<TopicGroup[]> {
  ref = args?.ref ?? 'main'
  source = args?.source ?? 'github'
  version = args?.version ?? 'v3'

  const topics: TopicGroup[] = (
    await Promise.all(
      topicOrder[version].map(
        async ({ groupLabel, topics: topicsGroup }) => ({
          groupLabel,
          topics: await Promise.all(
            topicsGroup.map(async (key) => {
              const topicSlug = key.toLowerCase()
              const filenames = await getFilenames({ topicSlug })

              if (filenames.length === 0) {
                return null
              }

              const parsedDocs: ParsedDoc[] = (
                await Promise.all(
                  filenames.map(async (docFilename) => {
                    const docMatter = await getDocMatter({ docFilename, topicSlug })

                    if (!docMatter) {
                      return null
                    }

                    return {
                      slug: docFilename.replace('.mdx', ''),
                      content: docMatter.content,
                      desc: docMatter.data.desc || docMatter.data.description || '',
                      headings: getHeadings(docMatter.content),
                      keywords: docMatter.data.keywords || '',
                      label: docMatter.data.label,
                      order: docMatter.data.order,
                      title: docMatter.data.title,
                    }
                  }),
                )
              ).filter(Boolean) as ParsedDoc[]

              return {
                slug: topicSlug,
                docs: parsedDocs.sort((a, b) => a.order - b.order),
                label: key,
              } as Topic
            }),
          ),
        }),
        [],
      ),
    )
  ).filter(Boolean) as TopicGroup[]

  return topics
}

export async function fetchSingleDoc(args: {
  docFilename: string
  ref?: typeof ref
  source?: typeof source
  topicGroupLabel: string
  topicSlug: string
  version?: typeof version
}): Promise<null | TopicGroup> {
  ref = args?.ref ?? 'main'
  source = args?.source ?? 'github'
  version = args?.version ?? 'v3'

  const topicGroupDefinition = topicOrder[version].find(
    (group) => group.groupLabel === args.topicGroupLabel,
  )

  const topicGroup: TopicGroup = {
    groupLabel: topicGroupDefinition?.groupLabel as string,
    topics: [
      {
        slug: args.topicSlug,
        // get label from  topicGroupDefinition
        docs: [],
        label: topicGroupDefinition?.topics.find(
          (topic) => topic.toLowerCase() === args.topicSlug,
        ) as string,
      },
    ],
  }

  const docMatter = await getDocMatter({ docFilename: args.docFilename, topicSlug: args.topicSlug })

  if (!docMatter) {
    return null
  }

  topicGroup.topics[0].docs.push({
    slug: args.docFilename.replace('.mdx', ''),
    content: docMatter.content,
    desc: docMatter.data.desc || docMatter.data.description || '',
    headings: getHeadings(docMatter.content),
    keywords: docMatter.data.keywords || '',
    label: docMatter.data.label,
    order: docMatter.data.order,
    title: docMatter.data.title,
  })

  return topicGroup
}
