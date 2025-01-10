import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    blockFields({
      name: 'bannerFields',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              admin: {
                width: '50%',
              },
              defaultValue: 'default',
              options: [
                {
                  label: 'Default',
                  value: 'default',
                },
                {
                  label: 'Success',
                  value: 'success',
                },
                {
                  label: 'Warning',
                  value: 'warning',
                },
                {
                  label: 'Error',
                  value: 'error',
                },
              ],
            },
            {
              name: 'addCheckmark',
              type: 'checkbox',
              admin: {
                style: {
                  alignSelf: 'center',
                },
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
      ],
    }),
  ],
}
