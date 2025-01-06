import type { Doc } from '@root/payload-types'
import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  defaultEditorFeatures,
  type DefaultTypedEditorState,
  EXPERIMENTAL_TableFeature,
  type FeatureProviderServer,
  lexicalEditor,
  sanitizeServerEditorConfig,
  type SerializedBlockNode,
} from '@payloadcms/richtext-lexical'
import { fetchDocs } from '@root/scripts/fetchDocs'
import { topicGroupsToDocsData } from '@root/scripts/syncDocs'
import { revalidatePath } from 'next/cache'

import { isAdmin } from '../../access/isAdmin'
import { BannerBlock } from './blocks/banner'
import { CodeBlock } from './blocks/code'
import { LightDarkImageBlock } from './blocks/lightDarkImage'
import { RestExamplesBlock } from './blocks/restExamples'
import { TableWithDrawersBlock } from './blocks/tableWithDrawers'
import { UploadBlock } from './blocks/upload'
import { YoutubeBlock } from './blocks/youtube'
import { lexicalToMDX } from './mdxToLexical'

export const contentLexicalEditorFeatures: FeatureProviderServer[] = [
  // Default features without upload
  ...defaultEditorFeatures.filter((feature) => feature.key !== 'upload'),
  EXPERIMENTAL_TableFeature(),
  BlocksFeature({
    blocks: [
      CodeBlock,
      BannerBlock,
      YoutubeBlock,
      LightDarkImageBlock,
      UploadBlock,
      RestExamplesBlock,
      TableWithDrawersBlock,
    ],
  }),
]

export const Docs: CollectionConfig = {
  slug: 'docs',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: ({ id, data, isReadingStaticFile, req }) => {
      const queryParams = req.query
      return (
        isAdmin({ id, data, isReadingStaticFile, req }) &&
        !!queryParams.branch &&
        queryParams.branch !== 'main'
      )
    },
  },
  admin: {
    components: {
      edit: {
        SaveButton: '@root/collections/Docs/SaveButton#SaveButtonClient',
      },
      views: {
        edit: {
          default: {
            actions: ['@root/collections/Docs/BranchButton#BranchButton'],
          },
        },
      },
    },
    defaultColumns: ['path', 'topic', 'slug', 'title'],
    useAsTitle: 'path',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: contentLexicalEditorFeatures,
              }),
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'keywords',
              type: 'text',
            },
            {
              name: 'headings',
              type: 'json',
            },

            {
              name: 'path',
              type: 'text',
              admin: {
                position: 'sidebar',
                readOnly: true,
              },
              hooks: {
                afterRead: [
                  ({ data }) => {
                    if (data) {
                      return `${data.topic}/${data.slug}`
                    }
                  },
                ],
              },
            },
            {
              name: 'topic',
              type: 'text',
              admin: {
                position: 'sidebar',
              },
              required: true,
            },
            {
              name: 'topicGroup',
              type: 'text',
              admin: {
                description:
                  'The topic group is displayed on the sidebar, but is not part of the URL',
                position: 'sidebar',
              },
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              admin: {
                position: 'sidebar',
              },
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'order',
              type: 'number',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'version',
              type: 'text',
              required: true,

              admin: {
                position: 'sidebar',
              },
            },
          ],
          label: 'Meta',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        const shouldCommit = req.query.commit === 'true'

        const _doc: Doc = doc as Doc

        if (shouldCommit) {
          const editorConfig = await sanitizeServerEditorConfig(
            {
              features: contentLexicalEditorFeatures,
            },
            req.payload.config,
          )

          const markdownFile = lexicalToMDX({
            editorConfig,
            editorState: _doc.content as DefaultTypedEditorState<SerializedBlockNode>,
            frontMatterData: {
              description: _doc.description ?? '',
              keywords: _doc.keywords?.length
                ? _doc.keywords.split(',').map((keyword) => keyword.trim())
                : [],
              label: _doc.label ?? '',
              order: _doc.order ?? 0,
              title: _doc.title ?? '',
            },
          })

          if (process.env.COMMIT_DOCS_API_URL?.length) {
            const fileContent = Buffer.from(markdownFile).toString('base64') // Convert content to Base64

            let branch: string = req.query.branch as string

            if (!branch) {
              branch = doc?.version === 'v2' ? '2.x' : 'main'
            }

            const response = await fetch(process.env.COMMIT_DOCS_API_URL, {
              body: JSON.stringify({
                branch,
                content: fileContent,
                path: doc.path,
              }),
              headers: {
                Authorization: 'API-Key ' + process.env.COMMIT_DOCS_API_KEY,
                'Content-Type': 'application/json',
              },
              method: 'POST',
            })

            if (!response.ok) {
              throw new Error(`Failed to commit docs: ${response.statusText}`)
            }
          }
        }

        if (doc?.version === 'v2') {
          revalidatePath('/(frontend)/(pages)/docs/v2/[topic]/[doc]', 'page')
        } else {
          // Revalidate all doc paths, to ensure that the sidebar is up-to-date for all docs
          revalidatePath('/(frontend)/(pages)/docs/[topic]/[doc]', 'page')
        }
      },
    ],
    afterRead: [
      async ({ doc, findMany, req }) => {
        if (findMany) {
          return doc
        }
        const queryParams = req.query

        if (!req.query.branch) {
          return doc // No special branch - no need to request special data
        }

        if (req.query.commit === 'true') {
          return doc // Save operation - no need to request special data
        }

        let branch: string = queryParams.branch as string
        const version: string = doc?.version === 'v2' ? 'v2' : 'v3'

        if (!branch) {
          branch = version === 'v2' ? '2.x' : 'main'
        }

        const topicGroups = await fetchDocs({ ref: branch, version })

        const { docsData } = await topicGroupsToDocsData({ req, topicGroups, version })

        const curDoc = docsData.find(
          (searchDoc) =>
            searchDoc.slug === doc.slug &&
            searchDoc.topic === doc.topic &&
            searchDoc.version === doc.version,
        )

        return curDoc
      },
    ],
  },
}
