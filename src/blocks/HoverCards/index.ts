import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import link from '../../fields/link'
import richText from '../../fields/richText'

export const HoverCards: Block = {
  slug: 'hoverCards',
  fields: [
    blockFields({
      name: 'hoverCardsFields',
      fields: [
        richText(),
        {
          name: 'cards',
          type: 'array',
          minRows: 1,
          maxRows: 3,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            link({
              disableLabel: true,
              appearances: false,
            }),
          ],
        },
      ],
    }),
  ],
}
