import type { CollectionConfig } from 'payload'

import { revalidatePath } from 'next/cache'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { CallToAction } from '../blocks/CallToAction'
import { Callout } from '../blocks/Callout'
import { CardGrid } from '../blocks/CardGrid'
import { CaseStudiesHighlight } from '../blocks/CaseStudiesHighlight'
import { CaseStudyCards } from '../blocks/CaseStudyCards'
import { CaseStudyParallax } from '../blocks/CaseStudyParallax'
import { CodeFeature } from '../blocks/CodeFeature'
import { Content } from '../blocks/Content'
import { ContentGrid } from '../blocks/ContentGrid'
import { ExampleTabs } from '../blocks/ExampleTabs'
import { Form } from '../blocks/Form'
import { HoverCards } from '../blocks/HoverCards'
import { HoverHighlights } from '../blocks/HoverHighlights'
import { LinkGrid } from '../blocks/LinkGrid'
import { LogoGrid } from '../blocks/LogoGrid'
import { MediaBlock } from '../blocks/Media'
import { MediaContent } from '../blocks/MediaContent'
import { MediaContentAccordion } from '../blocks/MediaContentAccordion'
import { Pricing } from '../blocks/Pricing'
import { ReusableContent } from '../blocks/ReusableContent'
import { Slider } from '../blocks/Slider'
import { Statement } from '../blocks/Statement'
import { Steps } from '../blocks/Steps'
import { StickyHighlights } from '../blocks/StickyHighlights'
import { fullTitle } from '../fields/fullTitle'
import { hero } from '../fields/hero'
import { slugField } from '../fields/slug'
import { formatPreviewURL } from '../utilities/formatPreviewURL'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['fullTitle', 'slug', 'createdAt', 'updatedAt'],
    livePreview: {
      url: ({ data }) => formatPreviewURL('pages', data),
    },
    preview: doc => formatPreviewURL('pages', doc),
    useAsTitle: 'fullTitle',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    fullTitle,
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                Callout,
                CallToAction,
                CardGrid,
                CaseStudyCards,
                CaseStudiesHighlight,
                CaseStudyParallax,
                CodeFeature,
                Content,
                ContentGrid,
                Form,
                HoverCards,
                HoverHighlights,
                LinkGrid,
                LogoGrid,
                MediaBlock,
                MediaContent,
                MediaContentAccordion,
                Pricing,
                ReusableContent,
                Slider,
                Statement,
                Steps,
                StickyHighlights,
                ExampleTabs,
              ],
              required: true,
            },
          ],
          label: 'Content',
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        if (doc._status === 'published') {
          if (doc.breadcrumbs && doc.breadcrumbs.length > 0) {
            revalidatePath(doc.breadcrumbs[doc.breadcrumbs.length - 1].url)
            console.log(`Revalidated: ${doc.breadcrumbs[doc.breadcrumbs.length - 1].url}`)
            if (doc.breadcrumbs[0].url === '/home') {
              revalidatePath('/')
              console.log(`Revalidated: /`)
            }
          } else {
            revalidatePath(`/${doc.slug}`)
            console.log(`Revalidated: /${doc.slug}`)
            if (doc.slug === 'home') {
              revalidatePath('/')
              console.log(`Revalidated: /`)
            }
          }
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
