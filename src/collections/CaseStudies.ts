// import { slateEditor } from '@payloadcms/richtext-slate'
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
import richText from '../fields/richText'
import { slugField } from '../fields/slug'
import { formatPreviewURL } from '../utilities/formatPreviewURL'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publishedOnly,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    livePreview: {
      url: ({ data }) => formatPreviewURL('case-studies', data),
    },
    preview: doc => formatPreviewURL('case-studies', doc),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    richText({
      name: 'introContent',
    }),
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
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      label: 'URL',
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath(`/case-studies/${doc.slug}`)
        revalidatePath(`/case-studies`, 'page')
        console.log(`Revalidated: /case-studies/${doc.slug}`)
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
