import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'

export const CaseStudiesHighlight: Block = {
  slug: 'caseStudiesHighlight',
  fields: [
    blockFields({
      name: 'caseStudiesHighlightFields',
      fields: [
        richText(),
        {
          name: 'caseStudies',
          type: 'relationship',
          hasMany: true,
          relationTo: 'case-studies',
          required: true,
        },
      ],
    }),
  ],
}
