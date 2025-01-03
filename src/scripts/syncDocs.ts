import type { TopicGroup } from '@root/collections/Docs/types'
import type { PayloadHandler, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

import { sanitizeServerEditorConfig } from '@payloadcms/richtext-lexical'
import { contentLexicalEditorFeatures } from '@root/collections/Docs'
import { mdxToLexical } from '@root/collections/Docs/mdxToLexical'

import { fetchDocs } from './fetchDocs.js'

export const topicGroupsToDocsData: (args: {
  req: PayloadRequest
  topicGroups: TopicGroup[]
  version: string
}) => Promise<{
  docsData: RequiredDataFromCollectionSlug<'docs'>[]
}> = async ({ req, topicGroups, version }) => {
  const editorConfig = await sanitizeServerEditorConfig(
    {
      features: contentLexicalEditorFeatures,
    },
    req.payload.config,
  )

  const docsData: RequiredDataFromCollectionSlug<'docs'>[] = []

  for (const topicGroup of topicGroups) {
    for (const topic of topicGroup.topics) {
      for (const doc of topic.docs) {
        const mdx = doc.content

        const { editorState } = mdxToLexical({
          editorConfig,
          mdx,
        })

        const newData: RequiredDataFromCollectionSlug<'docs'> = {
          slug: doc.slug,
          content: editorState as any,
          description: doc.desc,
          headings: doc.headings,
          keywords: doc.keywords,
          label: doc.label,
          order: doc.order,
          path: `${topic.slug}/${doc.slug}`,
          title: doc.title,
          topic: topic.slug,
          topicGroup: topicGroup.groupLabel,
          version,
        }
        docsData.push(newData)
      }
    }
  }

  return { docsData }
}

const importTopicGroups: (args: {
  req: PayloadRequest
  topicGroups: TopicGroup[]
  version: string
}) => Promise<{
  createdOrUpdatedDocs: string[]
}> = async ({ req, topicGroups, version }) => {
  const createdOrUpdatedDocs: string[] = []

  const { docsData } = await topicGroupsToDocsData({ req, topicGroups, version })

  for (const docData of docsData) {
    const existingDocs = await req.payload.find({
      collection: 'docs',
      where: {
        slug: { equals: docData.slug },
        topic: { equals: docData.topic },
        version: { equals: version },
      },
    })

    try {
      if (existingDocs.totalDocs === 1) {
        const { id } = await req.payload.update({
          id: existingDocs.docs[0].id,
          collection: 'docs',
          data: docData,
          depth: 0,
          select: {},
        })
        createdOrUpdatedDocs.push(id)
      } else {
        const { id } = await req.payload.create({
          collection: 'docs',
          data: docData,
          depth: 0,
          select: {},
        })
        createdOrUpdatedDocs.push(id)
      }
    } catch (err) {
      console.error('Error importing doc', err)
      req.payload.logger.error({
        err,
        msg: 'Error importing doc',
        path: docData?.path,
      })
      throw err
    }
  }

  return { createdOrUpdatedDocs }
}

export const syncDocs: PayloadHandler = async (req) => {
  const { payload } = req

  try {
    if (!process.env.GITHUB_ACCESS_TOKEN) {
      return new Response('No GitHub access token found', { status: 400 })
    }
    try {
      const allV3Docs = await fetchDocs({ ref: 'main', version: 'v3' })
      const allV2Docs = await fetchDocs({ ref: '2.x', version: 'v2' })

      const createdOrUpdatedDocs: string[] = []
      createdOrUpdatedDocs.push(
        ...(await importTopicGroups({ req, topicGroups: allV3Docs, version: 'v3' }))
          .createdOrUpdatedDocs,
        ...(await importTopicGroups({ req, topicGroups: allV2Docs, version: 'v2' }))
          .createdOrUpdatedDocs,
      )

      await payload.delete({
        collection: 'docs',
        depth: 0,
        where: {
          id: {
            not_in: createdOrUpdatedDocs,
          },
        },
      })
    } catch (err) {
      console.error('Error syncing docs', err)
      throw new Error(err)
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: unknown) {
    console.error('Error syncing docs', err)
    return new Response(JSON.stringify({ message: err, success: false }), { status: 400 })
  }
}
