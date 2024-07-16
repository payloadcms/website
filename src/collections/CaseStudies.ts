import { slateEditor } from '@payloadcms/richtext-slate'
import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { publishedOnly } from '../access/publishedOnly'
import { CallToAction } from '../blocks/CallToAction'
import { CardGrid } from '../blocks/CardGrid'
import { CaseStudiesHighlight } from '../blocks/CaseStudiesHighlight'
import { CodeFeature } from '../blocks/CodeFeature'
import { Content } from '../blocks/Content'
import { ContentGrid } from '../blocks/ContentGrid'
import { Form } from '../blocks/Form'
import { HoverHighlights } from '../blocks/HoverHighlights'
import { LinkGrid } from '../blocks/LinkGrid'
import { MediaBlock } from '../blocks/Media'
import { MediaContent } from '../blocks/MediaContent'
import { Pricing } from '../blocks/Pricing'
import { ReusableContent } from '../blocks/ReusableContent'
import { Slider } from '../blocks/Slider'
import { Steps } from '../blocks/Steps'
import { StickyHighlights } from '../blocks/StickyHighlights'
import richText from '../fields/richText'
import { slugField } from '../fields/slug'
import { formatPreviewURL } from '../utilities/formatPreviewURL'
import { revalidatePage } from '../utilities/revalidatePage'
import { Callout } from '../blocks/Callout'
import { CaseStudyCards } from '../blocks/CaseStudyCards'
import { CaseStudyParallax } from '../blocks/CaseStudyParallax'
import { ExampleTabs } from '../blocks/ExampleTabs'
import { HoverCards } from '../blocks/HoverCards'
import { LogoGrid } from '../blocks/LogoGrid'
import { Statement } from '../blocks/Statement'
import { MediaContentAccordion } from '../blocks/MediaContentAccordion'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    preview: doc => formatPreviewURL('case-studies', doc),
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
          collection: 'case-studies',
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
    richText(
      {
        name: 'introContent',
      },
      {
        elements: ['h1'],
        leaves: ['underline'],
      },
    ),
    {
      type: 'row',
      fields: [
        {
          name: 'industry',
          type: 'text',
        },
        {
          name: 'useCase',
          type: 'text',
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
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
    },
    slugField(),
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
