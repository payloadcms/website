import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import link from '../../fields/link'
import richText from '../../fields/richText'

export const LogoGrid: Block = {
  slug: 'logoGrid',
  fields: [
    blockFields({
      name: 'logoGridFields',
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
              condition: (_, { enableLink }) => enableLink,
            },
          },
        }),
        {
          name: 'logos',
          type: 'array',
          fields: [
            {
              name: 'logoMedia',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    }),
  ],
}
