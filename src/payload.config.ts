import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload'

import { CaseStudies } from './collections/CaseStudies'
import { CommunityHelp } from './collections/CommunityHelp'
import { Docs } from './collections/Docs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { ReusableContent } from './collections/ReusableContent'
import { Users } from './collections/Users'
import SyncDocsButton from './components/SyncDocsButton'
import { Footer } from './globals/Footer'
import { MainMenu } from './globals/MainMenu'
import { PartnerProgram } from './globals/PartnerProgram'
import syncDocs from './scripts/syncDocs'
import { Budgets, Industries, Regions, Specialties } from './collections/PartnerFilters'
import redeployWebsite from './scripts/redeployWebsite'
import RedeployButton from './components/RedeployButton'
import { slateEditor } from '@payloadcms/richtext-slate'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const mockModulePath = path.resolve(__dirname, './emptyModuleMock.js')

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
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
      path: '/sync/docs',
      method: 'get',
      handler: syncDocs,
    },
    {
      path: '/redeploy/website',
      method: 'post',
      handler: redeployWebsite,
    },
  ],
  globals: [Footer, MainMenu, PartnerProgram],
  graphQL: {
    disablePlaygroundInProduction: false,
  },
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
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
                  fields: submissionData.map(key => ({
                    name: key.field,
                    value: key.value,
                  })),
                  context: {
                    hutk: req.body && 'hubspotCookie' in req.body ? req.body?.hubspotCookie : '',
                    pageUri: req.body && 'pageUri' in req.body ? req.body?.pageUri : '',
                    pageName: req.body && 'pageName' in req.body ? req.body?.pageName : '',
                  },
                }
                try {
                  await fetch(
                    `https://api.hsforms.com/submissions/v3/integration/submit/${portalID}/${form.hubSpotFormID}`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(data),
                    },
                  )
                } catch (err: unknown) {
                  req.payload.logger.error({
                    msg: 'Fetch to HubSpot form submissions failed',
                    err,
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
  cors: [process.env.PAYLOAD_PUBLIC_APP_URL || '', 'https://payloadcms.com'].filter(Boolean),
  admin: {
    components: {
      afterNavLinks: [SyncDocsButton, RedeployButton],
    },
  },
})
