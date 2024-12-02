import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import link from '../../fields/link'

export const MediaContentAccordion: Block = {
  slug: 'mediaContentAccordion',
  fields: [
    blockFields({
      name: 'mediaContentAccordionFields',
      fields: [
        {
          name: 'alignment',
          type: 'select',
          admin: {
            description: 'Choose how to align the content for this block.',
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
          type: 'row',
          fields: [
            {
              name: 'leader',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'heading',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'accordion',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'position',
                  type: 'select',
                  admin: {
                    description: 'Choose how to position the media itself.',
                    width: '50%',
                  },
                  defaultValue: 'normal',
                  options: [
                    {
                      label: 'Normal',
                      value: 'normal',
                    },
                    {
                      label: 'Inset',
                      value: 'inset',
                    },
                    {
                      label: 'Wide',
                      value: 'wide',
                    },
                  ],
                },
                {
                  name: 'background',
                  type: 'select',
                  admin: {
                    description: 'Select the background you want to sit behind the media.',
                    width: '50%',
                  },
                  defaultValue: 'none',
                  options: [
                    {
                      label: 'None',
                      value: 'none',
                    },
                    {
                      label: 'Gradient',
                      value: 'gradient',
                    },
                    {
                      label: 'Scanlines',
                      value: 'scanlines',
                    },
                  ],
                },
              ],
            },
            {
              name: 'mediaLabel',
              type: 'text',
              required: true,
            },
            {
              name: 'mediaDescription',
              type: 'richText',
              required: true,
            },
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
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
          maxRows: 4,
          minRows: 1,
        },
      ],
    }),
  ],
}
