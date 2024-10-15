import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import link from '../../fields/link'
import richText from '../../fields/richText'

export const MediaContent: Block = {
  slug: 'mediaContent',
  fields: [
    blockFields({
      name: 'mediaContentFields',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'alignment',
              type: 'select',
              admin: {
                description: 'Choose how to align the content for this block.',
                width: '50%',
              },
              defaultValue: 'contentMedia',
              options: [
                {
                  label: 'Content + Media',
                  value: 'contentMedia',
                },
                {
                  label: 'Media + Content',
                  value: 'mediaContent',
                },
              ],
            },
            {
              name: 'mediaWidth',
              type: 'select',
              admin: {
                description: 'Choose how wide the media should be.',
                width: '50%',
              },
              defaultValue: 'stretch',
              options: [
                {
                  label: 'Stretch To Edge',
                  value: 'stretch',
                },
                {
                  label: 'Fit to Margin',
                  value: 'fit',
                },
              ],
            },
          ],
        },
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
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
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
