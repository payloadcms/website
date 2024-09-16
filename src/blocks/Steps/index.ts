import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import { CodeFeature } from '../CodeFeature'
import { Content } from '../Content'
import { HoverHighlights } from '../HoverHighlights'
import { StickyHighlights } from '../StickyHighlights'

export const Steps: Block = {
  slug: 'steps',
  labels: {
    singular: 'Steps Block',
    plural: 'Steps Blocks',
  },
  fields: [
    blockFields({
      name: 'stepsFields',
      fields: [
        {
          name: 'steps',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CodeFeature, Content, HoverHighlights, StickyHighlights],
            },
          ],
        },
      ],
    }),
  ],
}
