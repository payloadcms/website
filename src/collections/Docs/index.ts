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
import { fetchSingleDoc } from '@root/scripts/fetchDocs'
import { topicGroupsToDocsData } from '@root/scripts/syncDocs'
import { revalidatePath } from 'next/cache'

import { isAdmin } from '../../access/isAdmin'
import { BannerBlock } from './blocks/banner'
import { CodeBlock } from './blocks/code'
import { LightDarkImageBlock } from './blocks/lightDarkImage'
import { RestExamplesBlock } from './blocks/restExamples'
import { TableWithDrawersBlock } from './blocks/tableWithDrawers'
import { UploadBlock } from './blocks/upload'
import { VideoDrawerBlock } from './blocks/VideoDrawer'
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
      VideoDrawerBlock,
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
          livePreview: {
            actions: ['@root/collections/Docs/BranchButton#BranchButton'],
          },
        },
      },
    },
    defaultColumns: ['path', 'topic', 'slug', 'title'],
    livePreview: {
      url: ({ collectionConfig, data, locale }) =>
        `${process.env.NEXT_PUBLIC_CMS_URL}/docs/${data.path}`,
    },
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
    {
      name: 'mdx',
      type: 'textarea',
      admin: {
        hidden: true,
      },
      maxLength: Number.MAX_SAFE_INTEGER,
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc: _doc, findMany, req }) => {
        const doc: Doc = _doc
        if (findMany) {
          return doc
        }
        const queryParams = req.query

        if (!req.query.branch || req.query.branch === 'main' || req.query.branch === '2.x') {
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

        const topicGroup = await fetchSingleDoc({
          docFilename: doc.slug + '.mdx',
          ref: branch,
          topicGroupLabel: doc.topicGroup,
          topicSlug: doc.topic,
          version,
        })

        if (!topicGroup) {
          throw new Error('Failed to fetch topic group - topic group not found')
        }

        const { docsData } = await topicGroupsToDocsData({
          req,
          topicGroups: [topicGroup],
          version,
        })

        const curDoc = docsData[0]

        return curDoc
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const shouldCommit = req.query.commit === 'true'

        const _doc: Doc = data as Doc

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
              branch = _doc?.version === 'v2' ? '2.x' : 'main'
            }

            const response = await fetch(process.env.COMMIT_DOCS_API_URL, {
              body: JSON.stringify({
                branch,
                content: fileContent,
                path: _doc.path,
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

            if (branch !== '2.x' && branch !== 'main') {
              return originalDoc
            }
          }
        }

        if (_doc?.version === 'v2') {
          revalidatePath('/(frontend)/(pages)/docs/v2/[topic]/[doc]', 'page')
        } else {
          // Revalidate all doc paths, to ensure that the sidebar is up-to-date for all docs
          revalidatePath('/(frontend)/(pages)/docs/[topic]/[doc]', 'page')
        }
      },
    ],
  },
}
