import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'

export const CaseStudyCards: Block = {
  slug: 'caseStudyCards',
  labels: {
    singular: 'Case Study Cards',
    plural: 'Case Study Cards',
  },
  fields: [
    blockFields({
      name: 'caseStudyCardFields',
      fields: [
        {
          name: 'pixels',
          label: 'Show Pixel Background?',
          type: 'checkbox',
          defaultValue: true,
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
}
