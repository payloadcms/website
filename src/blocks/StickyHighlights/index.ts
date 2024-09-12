import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import codeBlips from '../../fields/codeBlips'
import link from '../../fields/link'
import richText from '../../fields/richText'

export const StickyHighlights: Block = {
  slug: 'stickyHighlights',
  fields: [
    blockFields({
      name: 'stickyHighlightsFields',
      fields: [
        {
          name: 'highlights',
          type: 'array',
          fields: [
            richText(),
            {
              name: 'enableLink',
              type: 'checkbox',
            },
            link({
              appearances: false,
              overrides: {
                admin: {
                  condition: (_, { enableLink }) => Boolean(enableLink),
                },
              },
            }),
            {
              name: 'type',
              type: 'radio',
              options: [
                {
                  label: 'Code',
                  value: 'code',
                },
                {
                  label: 'Media',
                  value: 'media',
                },
              ],
            },
            {
              name: 'code',
              type: 'code',
              admin: {
                condition: (_, { type }) => type === 'code',
              },
              required: true,
            },
            {
              ...codeBlips,
              admin: {
                condition: (_, { type }) => type === 'code',
              },
            },
            {
              name: 'media',
              type: 'upload',
              admin: {
                condition: (_, { type }) => type === 'media',
              },
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    }),
  ],
  labels: {
    plural: 'Sticky Highlights Blocks',
    singular: 'Sticky Highlights Block',
  },
}
