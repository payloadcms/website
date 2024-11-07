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
        {
          name: 'hideBackground',
          type: 'checkbox',
          label: 'Hide Background',
        },
        richText(),
        {
          name: 'cards',
          type: 'array',
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
              appearances: false,
              disableLabel: true,
            }),
          ],
          maxRows: 4,
          minRows: 1,
        },
      ],
    }),
  ],
}
