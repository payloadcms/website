import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { Banner } from '../blocks/Banner'
import { BlogContent } from '../blocks/BlogContent'
import { BlogMarkdown } from '../blocks/BlogMarkdown'
import { Callout } from '../blocks/Callout'
import { CallToAction } from '../blocks/CallToAction'
import { CardGrid } from '../blocks/CardGrid'
import { CaseStudiesHighlight } from '../blocks/CaseStudiesHighlight'
import { CaseStudyCards } from '../blocks/CaseStudyCards'
import { CaseStudyParallax } from '../blocks/CaseStudyParallax'
import { Code } from '../blocks/Code'
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
import { Slider } from '../blocks/Slider'
import { Steps } from '../blocks/Steps'
import { StickyHighlights } from '../blocks/StickyHighlights'
import { Statement } from '../blocks/Statement'
import { MediaContentAccordion } from '../blocks/MediaContentAccordion'

export const ReusableContent: CollectionConfig = {
  slug: 'reusable-content',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: isAdmin,
    read: () => true,
    readVersions: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  labels: {
    singular: 'Reusable Content',
    plural: 'Reusable Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [
        Banner,
        BlogContent,
        BlogMarkdown,
        Callout,
        CallToAction,
        CardGrid,
        CaseStudyCards,
        CaseStudiesHighlight,
        CaseStudyParallax,
        Code,
        CodeFeature,
        Content,
        ContentGrid,
        ExampleTabs,
        Form,
        HoverCards,
        HoverHighlights,
        LinkGrid,
        LogoGrid,
        MediaBlock,
        MediaContent,
        MediaContentAccordion,
        Pricing,
        Slider,
        Statement,
        Steps,
        StickyHighlights,
      ],
    },
  ],
}
