import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import link from '../../fields/link'
import linkGroup from '../../fields/linkGroup'
import richText from '../../fields/richText'

export const CardGrid: Block = {
  slug: 'cardGrid',
  fields: [
    blockFields({
      name: 'cardGridFields',
      fields: [
        richText(),
        linkGroup({
          appearances: false,
          overrides: {
            admin: {
              description: 'These links will be placed above the card grid as calls-to-action.',
            },
          },
        }),
        {
          name: 'revealDescription',
          type: 'checkbox',
          label: 'Reveal descriptions on hover?',
        },
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
            {
              name: 'enableLink',
              type: 'checkbox',
            },
            link({
              appearances: false,
              disableLabel: true,
              overrides: {
                admin: {
                  condition: (_, { enableLink }) => enableLink,
                },
              },
            }),
          ],
        },
      ],
    }),
  ],
}
