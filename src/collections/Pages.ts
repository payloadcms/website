import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { Callout } from '../blocks/Callout'
import { CallToAction } from '../blocks/CallToAction'
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
import { Pricing } from '../blocks/Pricing'
import { ReusableContent } from '../blocks/ReusableContent'
import { Slider } from '../blocks/Slider'
import { Steps } from '../blocks/Steps'
import { StickyHighlights } from '../blocks/StickyHighlights'
import { fullTitle } from '../fields/fullTitle'
import { hero } from '../fields/hero'
import { slugField } from '../fields/slug'
import { formatPreviewURL } from '../utilities/formatPreviewURL'
import { revalidatePage } from '../utilities/revalidatePage'
import { Statement } from '../blocks/Statement'
import { MediaContentAccordion } from '../blocks/MediaContentAccordion'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'fullTitle',
    preview: doc => formatPreviewURL('pages', doc),
    defaultColumns: ['fullTitle', 'slug', 'createdAt', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    create: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      ({ req: { payload }, doc }) => {
        revalidatePage({
          payload,
          collection: 'pages',
          doc,
        })
      },
    ],
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
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
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
            },
          ],
        },
      ],
    },
    slugField(),
  ],
}
