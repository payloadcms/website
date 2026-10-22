import type { TopicGroup } from '@root/collections/Docs/types'
import type { PayloadHandler, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

import { sanitizeServerEditorConfig } from '@payloadcms/richtext-lexical'
import { contentLexicalEditorFeatures } from '@root/collections/Docs'
import { versionToBranch } from '@root/collections/Docs/branchForVersion'
import { mdxToLexical } from '@root/collections/Docs/mdxToLexical'
import { topicOrder } from '@root/collections/Docs/topicOrder'

import { fetchDocs } from './fetchDocs'

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
          mdx,
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

const validateTopicGroups = ({
  topicGroups,
  version,
}: {
  topicGroups: TopicGroup[]
  version: keyof typeof versionToBranch
}): void => {
  // The legacy 2.x navigation still contains this topic, but the directory does not exist
  // on the 2.x branch. All other configured topics must be present and contain documents.
  const optionalTopics = version === 'v2' ? new Set(['experimental']) : new Set<string>()
  const fetchedTopics = new Map(
    topicGroups.flatMap(({ topics }) =>
      topics.map((topic) => [topic.slug, topic.docs.length] as const),
    ),
  )
  const missingTopics = topicOrder[version]
    .flatMap(({ topics }) => topics.map((topic) => topic.toLowerCase()))
    .filter((topic) => !optionalTopics.has(topic) && !fetchedTopics.get(topic))

  if (missingTopics.length > 0) {
    throw new Error(
      `Refusing to sync incomplete ${version} documentation. Missing or empty topics: ${missingTopics.join(', ')}`,
    )
  }
}

export const syncDocs: PayloadHandler = async (req) => {
  const { payload } = req

  try {
    const isAdmin = req.user?.collection === 'users' && req.user.roles?.includes('admin')
    const providedSecret = req.headers.get('x-release-secret')
    const isAutomation = Boolean(
      process.env.PAYLOAD_RELEASE_SECRET && providedSecret === process.env.PAYLOAD_RELEASE_SECRET,
    )

    if (!isAdmin && !isAutomation) {
      return Response.json({ message: 'Unauthorized', success: false }, { status: 401 })
    }

    if (!process.env.GITHUB_ACCESS_TOKEN) {
      return Response.json(
        { message: 'No GitHub access token found', success: false },
        { status: 400 },
      )
    }
    try {
      // fetchDocs uses module-level source context, so keep these calls sequential.
      const allV4Docs = await fetchDocs({ ref: versionToBranch.v4, version: 'v4' })
      const allV3Docs = await fetchDocs({ ref: versionToBranch.v3, version: 'v3' })
      const allV2Docs = await fetchDocs({ ref: versionToBranch.v2, version: 'v2' })

      validateTopicGroups({ topicGroups: allV4Docs, version: 'v4' })
      validateTopicGroups({ topicGroups: allV3Docs, version: 'v3' })
      validateTopicGroups({ topicGroups: allV2Docs, version: 'v2' })

      const createdOrUpdatedDocs: string[] = []
      createdOrUpdatedDocs.push(
        ...(await importTopicGroups({ req, topicGroups: allV4Docs, version: 'v4' }))
          .createdOrUpdatedDocs,
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

    return Response.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    console.error('Error syncing docs', err)
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({ message, success: false }, { status: 500 })
  }
}

export const refreshMdxToLexical: PayloadHandler = async (req) => {
  const { payload } = req
  try {
    const existingDocs = await payload.find({
      collection: 'docs',
      limit: 1000000,
      where: {},
    })
    await Promise.all(
      existingDocs.docs.map(async (doc) => {
        const editorConfig = await sanitizeServerEditorConfig(
          {
            features: contentLexicalEditorFeatures,
          },
          req.payload.config,
        )

        const { editorState } = mdxToLexical({
          editorConfig,
          mdx: doc.mdx ?? '',
        })

        await payload.update({
          id: doc.id,
          collection: 'docs',
          data: {
            content: editorState as any,
          },
          depth: 0,
          select: {},
        })
      }),
    )

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: unknown) {
    return new Response(JSON.stringify({ message: err, success: false }), { status: 400 })
  }
}
