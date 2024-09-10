import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import linkGroup from '../../fields/linkGroup'
import link from '../../fields/link'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const MediaContentAccordion: Block = {
  slug: 'mediaContentAccordion',
  fields: [
    blockFields({
      name: 'mediaContentAccordionFields',
      fields: [
        {
          name: 'alignment',
          type: 'select',
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
          admin: {
            description: 'Choose how to align the content for this block.',
          },
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
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'position',
                  type: 'select',
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
                  admin: {
                    description: 'Choose how to position the media itself.',
                    width: '50%',
                  },
                },
                {
                  name: 'background',
                  type: 'select',
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
                  admin: {
                    description: 'Select the background you want to sit behind the media.',
                    width: '50%',
                  },
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
              editor: lexicalEditor({
                features: ({ rootFeatures }) => rootFeatures,
              }),
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
        },
      ],
    }),
  ],
}
