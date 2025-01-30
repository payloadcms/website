import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'

export const CaseStudyCards: Block = {
  slug: 'caseStudyCards',
  fields: [
    blockFields({
      name: 'caseStudyCardFields',
      fields: [
        {
          name: 'pixels',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Pixel Background?',
        },
        {
          name: 'cards',
          type: 'array',
          fields: [
            richText(),
            {
              name: 'caseStudy',
              type: 'relationship',
              relationTo: 'case-studies',
              required: true,
            },
          ],
        },
      ],
    }),
  ],
  labels: {
    plural: 'Case Study Cards',
    singular: 'Case Study Cards',
  },
}
