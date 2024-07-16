/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dotenv from 'dotenv'
import matter from 'gray-matter'
import fetch from 'node-fetch'
import type { PayloadHandler } from 'payload/config'

import type { Doc } from '../payload-types'
import sanitizeSlug from '../utilities/sanitizeSlug'

dotenv.config()

const decodeBase64 = (
  string: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: 'string'): string },
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
    const text = raw.replace(/^###*\s/, '')
    const level = raw.slice(0, 3) === '###' ? 3 : 2
    return { text, level, id: sanitizeSlug(text) }
  })
}

const syncDocs: PayloadHandler = async (req, res) => {
  const { payload } = req
  let topics

  try {
    if (!process.env.GITHUB_ACCESS_TOKEN) {
      return res.status(400).json({ success: false, message: 'No GitHub access token found' })
    }

    const fetchDoc = async (topicSlug: string, docFilename: string): Promise<Doc> => {
      const json = await fetch(`${githubAPI}/contents/docs/${topicSlug}/${docFilename}`, {
        headers,
      }).then(response => response.json())

      const parsedDoc = matter(decodeBase64(json.content))

      const slug = docFilename.replace('.mdx', '')

      const doc: Doc = {
        content: parsedDoc.content,
        title: parsedDoc.data.title,
        topic: topicSlug,
        slug: slug,
        label: parsedDoc.data.label,
        order: parsedDoc.data.order,
        description: parsedDoc.data.desc || '',
        keywords: parsedDoc.data.keywords || '',
        headings: await getHeadings(parsedDoc.content),
        path: `${topicSlug}/${slug}`,
        id: '',
        updatedAt: '',
        createdAt: '',
      }

      return doc
    }

    const processDoc = async (doc: Doc) => {
      const existingDocs = await payload.find({
        collection: 'docs',
        where: {
          topic: { equals: doc.topic },
          slug: { equals: doc.slug },
        },
      })
      if (existingDocs.totalDocs === 1) {
        await payload.update({
          collection: 'docs',
          data: doc,
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

    const getTopics = await fetch(`${githubAPI}/contents/docs`, {
      headers,
    }).then(response => response.json())

    topics = getTopics.map(({ name }) => name)

    const allDocs = await Promise.all(
      topics.map(async unsanitizedTopicSlug => {
        const topicSlug = unsanitizedTopicSlug.toLowerCase()

        const docs = await fetch(`${githubAPI}/contents/docs/${topicSlug}`, {
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

    return res.status(200).json({ success: true })
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: `${err}` })
  }
}

export default syncDocs
