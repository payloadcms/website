import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import {
  BlocksFeature,
  SerializedBlockNode,
  SlateNode,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  SlateToLexicalFeature,
  convertSlateNodesToLexical,
  convertSlateToLexical,
  migrateSlateToLexical,
} from '@payloadcms/richtext-lexical/migrate'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import link from '@root/fields/link'
import richText from '@root/fields/richText'
import { SerializedLabelNode } from '@root/fields/richText/features/label/LabelNode'
import { LabelFeature } from '@root/fields/richText/features/label/server'
import { SerializedLargeBodyNode } from '@root/fields/richText/features/largeBody/LargeBodyNode'
import { LargeBodyFeature } from '@root/fields/richText/features/largeBody/server'
import ObjectID from 'bson-objectid'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { CaseStudies } from './collections/CaseStudies'
import { CommunityHelp } from './collections/CommunityHelp'
import { Docs } from './collections/Docs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Budgets, Industries, Regions, Specialties } from './collections/PartnerFilters'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { ReusableContent } from './collections/ReusableContent'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { MainMenu } from './globals/MainMenu'
import { PartnerProgram } from './globals/PartnerProgram'
import redeployWebsite from './scripts/redeployWebsite'
import syncDocs from './scripts/syncDocs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  collections: [
    CaseStudies,
    CommunityHelp,
    Docs,
    Media,
    Pages,
    Industries,
    Specialties,
    Regions,
    Budgets,
    Posts,
    ReusableContent,
    Users,
    Partners,
  ],
  endpoints: [
    {
      handler: syncDocs,
      method: 'get',
      path: '/sync/docs',
    },
    {
      handler: redeployWebsite,
      method: 'post',
      path: '/redeploy/website',
    },
  ],
  globals: [Footer, MainMenu, PartnerProgram],
  graphQL: {
    disablePlaygroundInProduction: false,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // editor: slateEditor({}),
  admin: {
    autoLogin: {
      email: 'dev2@payloadcms.com',
      password: 'test',
    },
    components: {
      afterNavLinks: ['@root/components/SyncDocsButton', '@root/components/RedeployButton'],
    },
    importMap: {
      baseDir: dirname,
    },
  },
  cors: [process.env.PAYLOAD_PUBLIC_APP_URL || '', 'https://payloadcms.com'].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      /*SlateToLexicalFeature({
        disableHooks: true,
        converters: ({ defaultConverters }) => [
          ...defaultConverters,
          {
            converter({ converters, slateNode }) {
              return {
                type: 'largeBody',
                children: convertSlateNodesToLexical({
                  canContainParagraphs: false,
                  converters,
                  parentNodeType: 'largeBody',
                  slateNodes: slateNode.children as SlateNode[],
                }),
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              } as const as SerializedLargeBodyNode
            },
            nodeTypes: ['large-body'],
          },
          {
            converter({ converters, slateNode }) {
              return {
                type: 'label',
                children: convertSlateNodesToLexical({
                  canContainParagraphs: false,
                  converters,
                  parentNodeType: 'label',
                  slateNodes: slateNode.children as SlateNode[],
                }),
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              } as const as SerializedLabelNode
            },
            nodeTypes: ['label'],
          },
          {
            converter({ converters, slateNode }) {
              const slateData = {
                children: slateNode.children,
                type: 'p',
              }

              return {
                type: 'block',
                fields: {
                  blockType: 'spotlight',
                  blockName: '',
                  id: new ObjectID().toHexString(),
                  element: slateNode.element,
                  richText: convertSlateToLexical({
                    converters,
                    slateData: [slateData],
                  }),
                },
                format: '',
                version: 2,
              } as const as SerializedBlockNode<{
                element: string
                richText: any
              }>
            },
            nodeTypes: ['spotlight'],
          },
          {
            converter({ converters, slateNode }) {
              return {
                type: 'block',
                fields: {
                  blockType: 'video',
                  url: `https://www.youtube.com/watch?v=${slateNode.id}`,
                  id: new ObjectID().toHexString(),
                  blockName: '',
                },
                format: '',
                version: 2,
              } as const as SerializedBlockNode<{
                url: string
              }>
            },
            nodeTypes: ['video'],
          },
          {
            converter({ converters, slateNode }) {
              return {
                type: 'block',
                fields: {
                  blockType: 'br',
                  blockName: ``,
                  id: new ObjectID().toHexString(),
                },
                format: '',
                version: 2,
              } as const as SerializedBlockNode
            },
            nodeTypes: ['br'],
          },
        ],
      }),*/
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'enableLink',
                type: 'checkbox',
                label: 'Enable Link',
              },
              link({
                appearances: false,
                disableLabel: true,
                overrides: {
                  admin: {
                    condition: (_, data) => Boolean(data?.enableLink),
                  },
                },
              }),
            ],
          },
        },
      }),
      LabelFeature(),
      LargeBodyFeature(),
      BlocksFeature({
        blocks: [
          {
            slug: 'spotlight',
            fields: [
              {
                name: 'element',
                type: 'select',
                options: [
                  {
                    label: 'H1',
                    value: 'h1',
                  },
                  {
                    label: 'H2',
                    value: 'h2',
                  },
                  {
                    label: 'H3',
                    value: 'h3',
                  },
                  {
                    label: 'Paragraph',
                    value: 'p',
                  },
                ],
              },
              {
                name: 'richText',
                type: 'richText',
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => [...rootFeatures],
                }),
              },
            ],
            interfaceName: 'SpotlightBlock',
          },
          {
            slug: 'video',
            fields: [
              {
                name: 'url',
                type: 'text',
              },
            ],
            interfaceName: 'VideoBlock',
          },
          {
            slug: 'br',
            fields: [
              {
                name: 'ignore',
                type: 'text',
              },
            ],

            interfaceName: 'BrBlock',
          },
        ],
      }),
    ],
  }),
  plugins: [
    formBuilderPlugin({
      formOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'hubSpotFormID',
            type: 'text',
            admin: {
              position: 'sidebar',
            },
          },
        ],
      },
      formSubmissionOverrides: {
        hooks: {
          afterChange: [
            ({ doc, req }) => {
              const sendSubmissionToHubSpot = async (): Promise<void> => {
                const { form, submissionData } = doc
                const portalID = process.env.PRIVATE_HUBSPOT_PORTAL_KEY
                const data = {
                  context: {
                    hutk: req.body && 'hubspotCookie' in req.body ? req.body?.hubspotCookie : '',
                    pageName: req.body && 'pageName' in req.body ? req.body?.pageName : '',
                    pageUri: req.body && 'pageUri' in req.body ? req.body?.pageUri : '',
                  },
                  fields: submissionData.map(key => ({
                    name: key.field,
                    value: key.value,
                  })),
                }
                try {
                  await fetch(
                    `https://api.hsforms.com/submissions/v3/integration/submit/${portalID}/${form.hubSpotFormID}`,
                    {
                      body: JSON.stringify(data),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      method: 'POST',
                    },
                  )
                } catch (err: unknown) {
                  req.payload.logger.error({
                    err,
                    msg: 'Fetch to HubSpot form submissions failed',
                  })
                }
              }
              void sendSubmissionToHubSpot()
            },
          ],
        },
      },
    }),
    seoPlugin({
      collections: ['case-studies', 'pages', 'posts'],
      uploadsCollection: 'media',
    }),
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: docs => docs.reduce((url, doc) => `${url}/${doc.slug as string}`, ''),
    }),
    redirectsPlugin({
      collections: ['case-studies', 'pages', 'posts'],
    }),
    vercelBlobStorage({
      collections: {
        media: {
          generateFileURL: ({ filename }) => {
            return `/api/media/file/${filename}`
          },
        },
      },
      enabled: Boolean(process.env.BLOB_STORAGE_ENABLED) || false,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
