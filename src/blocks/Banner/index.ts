// import { slateEditor } from '@payloadcms/richtext-slate'
import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

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
              admin: {
                width: '50%',
              },
            },
            {
              name: 'addCheckmark',
              type: 'checkbox',
              admin: {
                width: '50%',
                style: {
                  alignSelf: 'center',
                },
              },
            },
          ],
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => rootFeatures,
          }),
        },
      ],
    }),
  ],
}
