/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { PayloadHandler } from 'payload'

import matter from 'gray-matter'
import fetch from 'node-fetch'

import type { Doc } from '../payload-types'

import sanitizeSlug from '../utilities/sanitizeSlug'

const decodeBase64 = (
  string: { [Symbol.toPrimitive](hint: 'string'): string } | WithImplicitCoercion<string>,
) => {
  const buff = Buffer.from(string, 'base64')
  return buff.toString('utf8')
}

const githubAPI = 'https://api.github.com/repos/payloadcms/payload'

const headers = {
  Accept: 'application/vnd.github.v3+json.html',
  Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
}

function getHeadings(source: string) {
  const headingLines = source.split('\n').filter((line: string) => {
    return line.match(/^#{1,3}\s.+/gm)
  })

  return headingLines.map((raw: string) => {
    const text = raw.replace(/^#{2,}\s/, '')
    const level = raw.slice(0, 3) === '###' ? 3 : 2
    return { id: sanitizeSlug(text), level, text }
  })
}

const syncDocs: PayloadHandler = async req => {
  const { payload } = req
  let topics

  try {
    if (!process.env.GITHUB_ACCESS_TOKEN) {
      return new Response('No GitHub access token found', { status: 400 })
    }

    const fetchDoc = async (topicSlug: string, docFilename: string): Promise<Doc> => {
      const json: any = await fetch(`${githubAPI}/contents/docs/${topicSlug}/${docFilename}`, {
        headers,
      }).then(response => response.json())

      const parsedDoc = matter(decodeBase64(json.content))

      const slug = docFilename.replace('.mdx', '')

      const doc: Doc = {
        id: '',
        slug,
        content: parsedDoc.content,
        createdAt: '',
        description: parsedDoc.data.desc || '',
        headings: getHeadings(parsedDoc.content),
        keywords: parsedDoc.data.keywords || '',
        label: parsedDoc.data.label,
        order: parsedDoc.data.order,
        path: `${topicSlug}/${slug}`,
        title: parsedDoc.data.title,
        topic: topicSlug,
        updatedAt: '',
      }

      return doc
    }

    const processDoc = async (doc: Doc) => {
      const existingDocs = await payload.find({
        collection: 'docs',
        where: {
          slug: { equals: doc.slug },
          topic: { equals: doc.topic },
        },
      })
      if (existingDocs.totalDocs === 1) {
        await payload.update({
          collection: 'docs',
          data: doc as any,
          where: {
            id: { equals: existingDocs.docs[0].id },
          },
        })
      } else if (existingDocs.totalDocs === 0) {
        await payload.create({
          collection: 'docs',
          data: doc,
        })
      } else if (existingDocs.totalDocs > 1) {
        payload.logger.error(
          `Found ${existingDocs.totalDocs} documents with identical topic and slug: ${doc.topic} ${doc.slug}`,
        )
      }
    }

    const processAllDocs = async (finalDocs: Doc[][]) => {
      for (const docs of finalDocs) {
        await Promise.all(docs.map(processDoc))
      }
    }

    const getTopics: any = await fetch(`${githubAPI}/contents/docs`, {
      headers,
    }).then(response => response.json())

    topics = getTopics.map(({ name }) => name)

    const allDocs = await Promise.all(
      topics.map(async unsanitizedTopicSlug => {
        const topicSlug = unsanitizedTopicSlug.toLowerCase()

        const docs: any = await fetch(`${githubAPI}/contents/docs/${topicSlug}`, {
          headers,
        }).then(response => response.json())

        const docFilenames = docs.map(({ name }) => name)

        const parsedDocs = await Promise.all(
          docFilenames.map(docFilename => fetchDoc(topicSlug, docFilename)),
        )

        return parsedDocs
      }),
    )

    await processAllDocs(allDocs)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: unknown) {
    return new Response(JSON.stringify({ message: err, success: false }), { status: 400 })
  }
}

export default syncDocs
