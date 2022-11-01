import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import { serialize } from 'next-mdx-remote/serialize'
import slugify from '../../../../utilities/slugify'
import type { Doc, DocPath, Heading, Topic } from './types'

const githubAPIURL = 'https://api.github.com/repos/payloadcms/payload'
const githubRawContentURL = 'https://raw.githubusercontent.com/payloadcms/payload/master'

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

// if (process.env.GITHUB_ACCESS_TOKEN) {
//   headers.Authorization = `token ${process.env.GITHUB_ACCESS_TOKEN}`
// }

export async function getTopics(): Promise<Topic[]> {
  const topics: Topic[] = await Promise.all(
    topicOrder.map(async unsanitizedTopicSlug => {
      const topicSlug = unsanitizedTopicSlug.toLowerCase()

      const docs: Array<{ name: string }> = await fetch(
        `${githubAPIURL}/contents/docs/${topicSlug}`,
        {
          headers,
        },
      ).then(res => res.json())

      console.log(docs)

      const docSlugs = docs.map(({ name }) => name)

      const parsedDocs = await Promise.all(
        docSlugs.map(async docSlug => {
          const docRes = await fetch(`${githubRawContentURL}/docs/${topicSlug}/${docSlug}`)
          const rawDoc = await docRes.text()
          const parsedDoc = matter(rawDoc)

          return {
            title: parsedDoc.data.title,
            label: parsedDoc.data.label,
            slug: docSlug.replace('.mdx', ''),
            order: parsedDoc.data.order || 9999,
          }
        }),
      )

      const topic = {
        slug: topicSlug,
        docs: parsedDocs.sort((a, b) => a.order - b.order),
      }

      return topic
    }),
  )

  return topics
}

export async function getHeadings(source): Promise<Heading[]> {
  const headingLines = source.split('\n').filter(line => {
    return line.match(/^###*\s/)
  })

  return headingLines.map(raw => {
    const text = raw.replace(/^###*\s/, '')
    const level = raw.slice(0, 3) === '###' ? 3 : 2

    return { text, level, id: slugify(text) }
  })
}

export async function getDoc({ topic, doc }: DocPath): Promise<Doc> {
  const topics = await getTopics()

  const docRes = await fetch(`${githubRawContentURL}/docs/${topic}/${doc}.mdx`)
  const rawDoc = await docRes.text()

  const parsedDoc = matter(rawDoc)

  const parentTopicIndex = topics.findIndex(
    ({ slug: topicSlug }) => topicSlug.toLowerCase() === topic,
  )

  const parentTopic = topics[parentTopicIndex]

  const nextTopic = topics[parentTopicIndex + 1]

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

  if (parentTopic) {
    const docIndex = parentTopic?.docs.findIndex(({ slug: docSlug }) => docSlug === doc)

    if (parentTopic?.docs?.[docIndex + 1]) {
      docToReturn.next = {
        slug: parentTopic.docs[docIndex + 1].slug.replace('.mdx', ''),
        title: parentTopic.docs[docIndex + 1].title,
        label: parentTopic.docs[docIndex + 1].label,
        topic: parentTopic.slug,
      }
    } else if (nextTopic?.docs?.[0]) {
      docToReturn.next = {
        slug: nextTopic.docs[0].slug.replace('.mdx', ''),
        title: nextTopic.docs[0].title,
        label: nextTopic.docs[0].label,
        topic: nextTopic.slug,
      }
    }
  }

  return docToReturn
}
