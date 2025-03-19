import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { Banner } from '@root/blocks/Banner'

export const ReusableContent: CollectionConfig = {
  slug: 'reusable-content',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    readVersions: isAdmin,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
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
      blockReferences: [
        Banner,
        'blogContent',
        'blogMarkdown',
        'callout',
        'cta',
        'cardGrid',
        'caseStudyCards',
        'caseStudiesHighlight',
        'caseStudyParallax',
        'Code',
        'codeFeature',
        'comparisonTable',
        'content',
        'contentGrid',
        'exampleTabs',
        'form',
        'hoverCards',
        'hoverHighlights',
        'linkGrid',
        'logoGrid',
        'mediaBlock',
        'mediaContent',
        'mediaContentAccordion',
        'pricing',
        'slider',
        'statement',
        'steps',
        'stickyHighlights',
      ],
      blocks: [],
      required: true,
    },
  ],
  labels: {
    plural: 'Reusable Contents',
    singular: 'Reusable Content',
  },
}
