import { revalidateRedirects } from '@hooks/revalidateRedirects'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { BlocksFeature, UploadFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
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
import syncDocs from './scripts/syncDocs'

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
      afterNavLinks: ['@root/components/SyncDocsButton', '@root/components/RedeployButton'],
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
    Industries,
    Specialties,
    Regions,
    Budgets,
    Posts,
    ReusableContent,
    Users,
    Partners,
  ],
  cors: [process.env.PAYLOAD_PUBLIC_APP_URL || '', 'https://payloadcms.com'].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  defaultDepth: 1,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
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
                  features: [...defaultFeatures],
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
          {
            slug: 'banner',
            fields: [
              {
                name: 'type',
                type: 'select',
                defaultValue: 'default',
                options: [
                  {
                    label: 'Default',
                    value: 'default',
                  },
                  {
                    label: 'Success',
                    value: 'success',
                  },
                  {
                    label: 'Warning',
                    value: 'warning',
                  },
                  {
                    label: 'Error',
                    value: 'error',
                  },
                ],
              },
              {
                name: 'content',
                type: 'richText',
                editor: lexicalEditor(),
              },
            ],
            interfaceName: 'BannerBlock',
          },
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

              const sendSubmissionToHubSpot = async (): Promise<void> => {
                const { form, submissionData } = doc
                const portalID = process.env.NEXT_PRIVATE_HUBSPOT_PORTAL_KEY
                const data = {
                  context: {
                    ...(req.body &&
                      'hubspotCookie' in req.body && { hutk: req.body?.hubspotCookie }),
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
      generateURL: docs => docs.reduce((url, doc) => `${url}/${doc.slug as string}`, ''),
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
