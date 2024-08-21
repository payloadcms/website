import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
// import { slateEditor } from '@payloadcms/richtext-slate'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'

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
import RedeployButton from './components/RedeployButton'
import SyncDocsButton from './components/SyncDocsButton'
import { Footer } from './globals/Footer'
import { MainMenu } from './globals/MainMenu'
import { PartnerProgram } from './globals/PartnerProgram'
import redeployWebsite from './scripts/redeployWebsite'
import syncDocs from './scripts/syncDocs'

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
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  // editor: slateEditor({}),
  admin: {
    autoLogin: {
      email: 'dev2@payloadcms.com',
      password: 'test',
    },
    components: {
      afterNavLinks: [SyncDocsButton, RedeployButton],
    },
  },
  cors: [process.env.PAYLOAD_PUBLIC_APP_URL || '', 'https://payloadcms.com'].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor(),
  async onInit(payload) {
    const user = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'dev2@payloadcms.com',
        },
      },
    })
    console.log('user', user)
    if (!user?.docs?.length) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev2@payloadcms.com',
          firstName: 'Dev',
          lastName: 'User',
          password: 'test',
          roles: ['admin'],
        },
      })
    }
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
              sendSubmissionToHubSpot()
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
      generateURL: docs => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    redirectsPlugin({
      collections: ['case-studies', 'pages', 'posts'],
    }),
  ],
})
