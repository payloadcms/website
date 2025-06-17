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
  LinkFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import link from '@root/fields/link'
import { LabelFeature } from '@root/fields/richText/features/label/server'
import { LargeBodyFeature } from '@root/fields/richText/features/largeBody/server'
import { revalidateTag } from 'next/cache'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import path from 'path'
import { buildConfig, type TextField } from 'payload'
import { fileURLToPath } from 'url'

import { BlogContent } from './blocks/BlogContent'
import { BlogMarkdown } from './blocks/BlogMarkdown'
import { Callout } from './blocks/Callout'
import { CallToAction } from './blocks/CallToAction'
import { CardGrid } from './blocks/CardGrid'
import { CaseStudiesHighlight } from './blocks/CaseStudiesHighlight'
import { CaseStudyCards } from './blocks/CaseStudyCards'
import { CaseStudyParallax } from './blocks/CaseStudyParallax'
import { Code } from './blocks/Code'
import { CodeFeature } from './blocks/CodeFeature'
import { ComparisonTable } from './blocks/ComparisonTable'
import { Content } from './blocks/Content'
import { ContentGrid } from './blocks/ContentGrid'
import { DownloadBlock } from './blocks/Download'
import { CodeExampleBlock, ExampleTabs, MediaExampleBlock } from './blocks/ExampleTabs'
import { Form } from './blocks/Form'
import { HoverCards } from './blocks/HoverCards'
import { HoverHighlights } from './blocks/HoverHighlights'
import { LinkGrid } from './blocks/LinkGrid'
import { LogoGrid } from './blocks/LogoGrid'
import { MediaBlock } from './blocks/Media'
import { MediaContent } from './blocks/MediaContent'
import { MediaContentAccordion } from './blocks/MediaContentAccordion'
import { Pricing } from './blocks/Pricing'
import { ReusableContent as ReusableContentBlock } from './blocks/ReusableContent'
import { Slider } from './blocks/Slider'
import { Statement } from './blocks/Statement'
import { Steps } from './blocks/Steps'
import { StickyHighlights } from './blocks/StickyHighlights'
import { CaseStudies } from './collections/CaseStudies'
import { Categories } from './collections/Categories'
import { CommunityHelp } from './collections/CommunityHelp'
import { Docs } from './collections/Docs'
import { BannerBlock } from './collections/Docs/blocks/banner'
import { CodeBlock } from './collections/Docs/blocks/code'
import { LightDarkImageBlock } from './collections/Docs/blocks/lightDarkImage'
import { ResourceBlock } from './collections/Docs/blocks/resource'
import { RestExamplesBlock } from './collections/Docs/blocks/restExamples'
import { TableWithDrawersBlock } from './collections/Docs/blocks/tableWithDrawers'
import { UploadBlock } from './collections/Docs/blocks/upload'
import { VideoDrawerBlock } from './collections/Docs/blocks/VideoDrawer'
import { YoutubeBlock } from './collections/Docs/blocks/youtube'
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
import { TopBar } from './globals/TopBar'
import { opsCounterPlugin } from './plugins/opsCounter'
import redeployWebsite from './scripts/redeployWebsite'
import { refreshMdxToLexical, syncDocs } from './scripts/syncDocs'

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
  blocks: [
    BlogContent,
    BlogMarkdown,
    CodeExampleBlock,
    MediaExampleBlock,
    Callout,
    CallToAction,
    DownloadBlock,
    LightDarkImageBlock,
    TableWithDrawersBlock,
    YoutubeBlock,
    CardGrid,
    CaseStudyCards,
    CaseStudiesHighlight,
    UploadBlock,
    CaseStudyParallax,
    CodeFeature,
    Content,
    ContentGrid,
    ComparisonTable,
    Form,
    HoverCards,
    HoverHighlights,
    LinkGrid,
    LogoGrid,
    MediaBlock,
    MediaContent,
    MediaContentAccordion,
    RestExamplesBlock,
    Pricing,
    ReusableContentBlock,
    ResourceBlock,
    Slider,
    Statement,
    Steps,
    StickyHighlights,
    ExampleTabs,
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
    VideoDrawerBlock,
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
      slug: 'command',
      fields: [
        {
          name: 'command',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        plural: 'Command Lines',
        singular: 'Command Line',
      },
    },
    {
      slug: 'link',
      fields: [link()],
      labels: {
        plural: 'Links',
        singular: 'Link',
      },
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
    Code,
  ],
  collections: [
    CaseStudies,
    CommunityHelp,
    Docs,
    Media,
    Pages,
    Posts,
    Categories,
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
      ...defaultFeatures.filter((feature) => feature.key !== 'link'),
      LinkFeature({
        fields({ defaultFields }) {
          return [
            ...defaultFields.filter((field) => field.name !== 'url'),
            {
              // Own url field to disable URL encoding links starting with '../'
              name: 'url',
              type: 'text',
              label: ({ t }) => t('fields:enterURL'),
              required: true,
              validate: (value: string, options) => {
                return
              },
            } as TextField,
          ]
        },
      }),
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
          'spotlight',
          'video',
          'br',
          'Banner',
          'VideoDrawer',
          'templateCards',
          'Code',
          'downloadBlock',
          'commandLine',
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
    {
      handler: refreshMdxToLexical,
      method: 'get',
      path: '/refresh/mdx-to-lexical',
    },
  ],
  globals: [Footer, MainMenu, GetStarted, PartnerProgram, TopBar],
  graphQL: {
    disablePlaygroundInProduction: false,
  },
  plugins: [
    opsCounterPlugin({
      max: 200,
      warnAt: 25,
    }),
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
          {
            name: 'requireRecaptcha',
            type: 'checkbox',
            admin: {
              position: 'sidebar',
            },
            label: 'Require reCAPTCHA',
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
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'recaptcha',
            type: 'text',
            validate: async (value, { req, siblingData }) => {
              const form = await req.payload.findByID({
                id: siblingData?.form,
                collection: 'forms',
              })

              if (!form?.requireRecaptcha) {
                return true
              }

              if (!value) {
                return 'Please complete the reCAPTCHA'
              }

              const res = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_PRIVATE_RECAPTCHA_SECRET_KEY}&response=${value}`,
                {
                  method: 'POST',
                },
              )
              const data = await res.json()
              if (!data.success) {
                return 'Invalid captcha'
              } else {
                return true
              }
            },
          },
        ],
        hooks: {
          afterChange: [
            async ({ doc, req }) => {
              req.payload.logger.info('Form Submission Received')
              req.payload.logger.info(Object.fromEntries(req?.headers.entries()))

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
