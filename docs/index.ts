import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import rawMDX from '@mdx-js/mdx'
import visit from 'unist-util-visit'
import mdastToString from 'mdast-util-to-string'
import slugify from '../utilities/slugify'

const compiler = rawMDX.createMdxAstCompiler({ remarkPlugins: [] })

const docsDirectory = join(process.cwd(), './node_modules/payload/docs')

export interface Heading {
  id: string
  depth: number
  text: string
}

export interface Doc {
  content: string
  data: {
    order: number
    title: string
    label: string
    desc: string
    keywords: string
  }
  next?: {
    slug: string
    title: string
    label: string
    topic: string
  }
  headings: Heading[]
}

export interface DocPath {
  topic: string
  doc: string
}

export interface DocMeta {
  title: string
  label: string
  slug: string
  order: number
}

export interface Topic {
  docs: DocMeta[]
  slug: string
}

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

export function getTopics(): Topic[] {
  const topics = topicOrder.map(topicSlug => {
    const topicDirectory = join(docsDirectory, `./${topicSlug.toLowerCase()}`)
    const docSlugs = fs.readdirSync(topicDirectory)

    const topic = {
      slug: topicSlug,
      docs: docSlugs
        .map(docSlug => {
          const rawDoc = fs.readFileSync(
            `${docsDirectory}/${topicSlug.toLowerCase()}/${docSlug}`,
            'utf8',
          )
          const parsedDoc = matter(rawDoc)

          return {
            title: parsedDoc.data.title || docSlug,
            label: parsedDoc.data.label,
            slug: docSlug.replace('.mdx', ''),
            order: parsedDoc.data.order || 9999,
            desc: parsedDoc.data.desc || '',
            keywords: parsedDoc.data.keywords || '',
          }
        })
        .sort((a, b) => a.order - b.order),
    }

    return topic
  })

  return topics
}

export function getDocPaths(): DocPath[] {
  const paths: DocPath[] = []

  topicOrder.forEach(topic => {
    const topicDirectory = join(docsDirectory, `./${topic.toLowerCase()}`)

    const filenames = fs.readdirSync(topicDirectory)

    filenames.forEach(filename =>
      paths.push({
        doc: filename.replace('.mdx', ''),
        topic: topic.toLowerCase(),
      }),
    )
  })

  return paths
}

export function getDoc({ topic, doc }: DocPath): Doc {
  const topics = getTopics()
  const rawDoc = fs.readFileSync(`${docsDirectory}/${topic}/${doc}.mdx`, 'utf8')
  const parsedDoc = matter(rawDoc)

  const parentTopicIndex = topics.findIndex(
    ({ slug: topicSlug }) => topicSlug.toLowerCase() === topic,
  )
  const parentTopic = topics[parentTopicIndex]

  const nextTopic = topics[parentTopicIndex + 1]

  const docToReturn: Doc = {
    content: parsedDoc.content,
    data: {
      title: parsedDoc.data.title,
      label: parsedDoc.data.label,
      order: parsedDoc.data.order,
      desc: parsedDoc.data.desc || '',
      keywords: parsedDoc.data.keywords || '',
    },
    headings: [],
  }

  const ast = compiler.parse(parsedDoc.content)

  const headingDepths = [2, 3]

  visit(ast, (node: any) => {
    if (node.type === 'heading' && headingDepths.indexOf(node.depth as number) > -1) {
      docToReturn.headings.push({
        text: mdastToString(node),
        id: slugify(mdastToString(node)),
        depth: node.depth as number,
      })
    }
  })

  if (parentTopic) {
    const docIndex = parentTopic?.docs.findIndex(({ slug: docSlug }) => docSlug === doc)

    if (parentTopic?.docs?.[docIndex + 1]) {
      docToReturn.next = {
        slug: parentTopic.docs[docIndex + 1].slug.replace('.mdx', ''),
        title: parentTopic.docs[docIndex + 1].title,
        label: parentTopic.docs[docIndex + 1].label,
        topic: parentTopic.slug,
      }
    } else if (nextTopic && nextTopic?.docs?.[0]) {
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
