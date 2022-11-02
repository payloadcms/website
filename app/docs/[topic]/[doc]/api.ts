import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import { serialize } from 'next-mdx-remote/serialize'
import { decodeBase64 } from '@root/utilities/decode-base-64'
import slugify from '../../../../utilities/slugify'
import type { Doc, DocPath, Heading, Topic } from './types'

const githubAPI = 'https://api.github.com/repos/payloadcms/payload'

export const topicOrder = [
  'Getting-Started',
  'Configuration',
  'Fields',
  'Admin',
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
]

const headers: { Accept: string; Authorization?: string } = {
  Accept: 'application/vnd.github.v3+json.html',
}

if (process.env.GITHUB_ACCESS_TOKEN) {
  headers.Authorization = `token ${process.env.GITHUB_ACCESS_TOKEN}`
}

export async function getTopics(): Promise<Topic[]> {
  const topics: Topic[] = await Promise.all(
    topicOrder.map(async unsanitizedTopicSlug => {
      const topicSlug = unsanitizedTopicSlug.toLowerCase()

      const docs: Array<{ name: string }> = await fetch(`${githubAPI}/contents/docs/${topicSlug}`, {
        headers,
      }).then(res => res.json())

      const docFilenames = docs.map(({ name }) => name)

      const parsedDocs = await Promise.all(
        docFilenames.map(async docFilename => {
          const json = await fetch(`${githubAPI}/contents/docs/${topicSlug}/${docFilename}`, {
            headers,
          }).then(res => res.json())

          const parsedDoc = matter(decodeBase64(json.content))

          return {
            title: parsedDoc.data.title,
            label: parsedDoc.data.label,
            slug: docFilename.replace('.mdx', ''),
            order: parsedDoc.data.order || 9999,
          }
        }),
      )

      const topic = {
        slug: unsanitizedTopicSlug,
        docs: parsedDocs.sort((a, b) => a.order - b.order),
      }

      return topic
    }),
  )

  return topics
}

export async function getHeadings(source): Promise<Heading[]> {
  const headingLines = source.split('\n').filter(line => {
    return line.match(/^#{1,3}\s.+/gm)
  })

  return headingLines.map(raw => {
    const text = raw.replace(/^###*\s/, '')
    const level = raw.slice(0, 3) === '###' ? 3 : 2
    return { text, level, id: slugify(text) }
  })
}

export async function getDoc({ topic, doc }: DocPath): Promise<Doc> {
  const json = await fetch(`${githubAPI}/contents/docs/${topic}/${doc}.mdx`, {
    headers,
  }).then(res => res.json())

  const parsedDoc = matter(decodeBase64(json.content))

  const docToReturn: Doc = {
    content: await serialize(parsedDoc.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    }),
    data: {
      title: parsedDoc.data.title,
      label: parsedDoc.data.label,
      order: parsedDoc.data.order,
      desc: parsedDoc.data.desc || '',
      keywords: parsedDoc.data.keywords || '',
    },
    headings: await getHeadings(parsedDoc.content),
  }

  return docToReturn
}
