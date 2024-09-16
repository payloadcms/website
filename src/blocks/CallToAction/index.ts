import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import linkGroup from '../../fields/linkGroup'
import richText from '../../fields/richText'

export const CallToAction: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    blockFields({
      name: 'ctaFields',
      fields: [
        richText(),
        linkGroup({
          appearances: false,
          additions: {
            npmCta: true,
          },
        }),
      ],
    }),
  ],
}
