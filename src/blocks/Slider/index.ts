import type { Block } from 'payload'

import link from '@root/fields/link'
import linkGroup from '@root/fields/linkGroup'

import { blockFields } from '../../fields/blockFields'

export const Slider: Block = {
  slug: 'slider',
  fields: [
    blockFields({
      name: 'sliderFields',
      fields: [
        {
          name: 'introContent',
          type: 'richText',
        },
        linkGroup(),
        {
          name: 'quoteSlides',
          type: 'array',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'author',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'enableLink',
              type: 'checkbox',
              label: 'Enable Link',
            },
            link({
              appearances: false,
              // disableLabel: true,
              overrides: {
                admin: {
                  condition: (_, siblingData) => siblingData?.enableLink,
                },
              },
            }),
          ],
          minRows: 3,
          required: true,
        },
      ],
    }),
  ],
}
