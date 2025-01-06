/* eslint-disable no-restricted-exports */
import { revalidateRedirects } from '@hooks/revalidateRedirects'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import link from '@root/fields/link'
import { LabelFeature } from '@root/fields/richText/features/label/server'
import { LargeBodyFeature } from '@root/fields/richText/features/largeBody/server'
import { revalidateTag } from 'next/cache'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { CaseStudies } from './collections/CaseStudies'
import { CommunityHelp } from './collections/CommunityHelp'
import { Docs } from './collections/Docs'
import { BannerBlock } from './collections/Docs/blocks/banner'
import { CodeBlock } from './collections/Docs/blocks/code'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Budgets, Industries, Regions, Specialties } from './collections/PartnerFilters'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { ReusableContent } from './collections/ReusableContent'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { GetStarted } from './globals/GetStarted'
import { MainMenu } from './globals/MainMenu'
import { PartnerProgram } from './globals/PartnerProgram'
import redeployWebsite from './scripts/redeployWebsite'
import { syncDocs } from './scripts/syncDocs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const sendGridAPIKey = process.env.SENDGRID_API_KEY

const sendgridConfig = {
  transportOptions: nodemailerSendgrid({
    apiKey: sendGridAPIKey,
  }),
}

export default buildConfig({
  admin: {
    autoLogin: {
      email: 'dev2@payloadcms.com',
      password: 'test',
    },
    components: {
      afterNavLinks: ['@root/components/AfterNavActions'],
    },
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [
    CaseStudies,
    CommunityHelp,
    Docs,
    Media,
    Pages,
    Posts,
    ReusableContent,
    Users,
    Partners,
    Industries,
    Specialties,
    Regions,
    Budgets,
  ],
  cors: [
    process.env.PAYLOAD_PUBLIC_APP_URL || '',
    'https://payloadcms.com',
    'https://discord.com/api',
  ].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  defaultDepth: 1,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
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
                editor: lexicalEditor(),
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
          {
            slug: 'commandLine',
            fields: [
              {
                name: 'command',
                type: 'text',
              },
            ],
            interfaceName: 'CommandLineBlock',
          },
          {
            slug: 'templateCards',
            fields: [
              {
                name: 'templates',
                type: 'array',
                fields: [
                  {
                    name: 'name',
                    type: 'text',
                    required: true,
                  },
                  {
                    name: 'description',
                    type: 'textarea',
                    required: true,
                  },
                  {
                    name: 'image',
                    type: 'text',
                    required: true,
                  },
                  {
                    name: 'slug',
                    type: 'text',
                    required: true,
                  },
                  {
                    name: 'order',
                    type: 'number',
                    required: true,
                  },
                ],
                labels: {
                  plural: 'Templates',
                  singular: 'Template',
                },
              },
            ],
            interfaceName: 'TemplateCardsBlock',
          },
          BannerBlock,
          CodeBlock,
        ],
      }),
    ],
  }),
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    ...sendgridConfig,
  }),
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
  globals: [Footer, MainMenu, GetStarted, PartnerProgram],
  graphQL: {
    disablePlaygroundInProduction: false,
  },
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
            label: 'HubSpot Form ID',
          },
          {
            name: 'customID',
            type: 'text',
            admin: {
              description: 'Attached to submission button to track clicks',
              position: 'sidebar',
            },
            label: 'Custom ID',
          },
        ],
        hooks: {
          afterChange: [
            ({ doc }) => {
              revalidateTag(`form-${doc.title}`)
              console.log(`Revalidated form: ${doc.title}`)
            },
          ],
        },
      },
      formSubmissionOverrides: {
        hooks: {
          afterChange: [
            async ({ doc, req }) => {
              req.payload.logger.info('IP of form submission')
              req.payload.logger.info({
                allHeaders: req?.headers,
                forwardedFor: req?.headers?.['x-forwarded-for'],
                realIP: req?.headers?.['x-real-ip'],
              })

              const body = req.json ? await req.json() : {}

              const sendSubmissionToHubSpot = async (): Promise<void> => {
                const { form, submissionData } = doc
                const portalID = process.env.NEXT_PRIVATE_HUBSPOT_PORTAL_KEY
                const data = {
                  context: {
                    ...('hubspotCookie' in body && { hutk: body?.hubspotCookie }),
                    pageName: 'pageName' in body ? body?.pageName : '',
                    pageUri: 'pageUri' in body ? body?.pageUri : '',
                  },
                  fields: submissionData.map((key) => ({
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
              await sendSubmissionToHubSpot()
            },
          ],
        },
      },
    }),
    seoPlugin({
      collections: ['case-studies', 'pages', 'posts'],
      globals: ['get-started'],
      uploadsCollection: 'media',
    }),
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug as string}`, ''),
    }),
    redirectsPlugin({
      collections: ['case-studies', 'pages', 'posts'],
      overrides: {
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    vercelBlobStorage({
      cacheControlMaxAge: 60 * 60 * 24 * 365, // 1 year
      collections: {
        media: {
          generateFileURL: ({ filename }) => `https://${process.env.BLOB_STORE_ID}/${filename}`,
        },
      },
      enabled: Boolean(process.env.BLOB_STORAGE_ENABLED) || false,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
