import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import link from '../../fields/link'
import richText from '../../fields/richText'

export const HoverHighlights: Block = {
  slug: 'hoverHighlights',
  fields: [
    blockFields({
      name: 'hoverHighlightsFields',
      fields: [
        {
          name: 'beforeHighlights',
          type: 'textarea',
        },
        {
          name: 'highlights',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'media',
              type: 'group',
              admin: {
                hideGutter: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'top',
                      type: 'upload',
                      admin: {
                        width: '50%',
                      },
                      relationTo: 'media',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'bottom',
                      type: 'upload',
                      admin: {
                        width: '50%',
                      },
                      relationTo: 'media',
                    },
                  ],
                },
              ],
              label: 'Media',
            },
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
        },
        {
          name: 'afterHighlights',
          type: 'textarea',
        },
        link({
          appearances: false,
        }),
      ],
    }),
  ],
  labels: {
    plural: 'Hover Highlights Blocks',
    singular: 'Hover Highlights Block',
  },
}
