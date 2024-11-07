import type { Block } from 'payload'

import { blockFields } from '@root/fields/blockFields'
import link from '@root/fields/link'
import linkGroup from '@root/fields/linkGroup'
import richText from '@root/fields/richText'

export const CallToAction: Block = {
  slug: 'cta',
  fields: [
    blockFields({
      name: 'ctaFields',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'buttons',
          options: [
            {
              label: 'Buttons',
              value: 'buttons',
            },
            {
              label: 'Banner',
              value: 'banner',
            },
          ],
        },
        richText(),
        {
          name: 'commandLine',
          type: 'text',
          admin: {
            condition: (_, { style }) => style === 'buttons',
          },
        },
        linkGroup({
          additions: {
            npmCta: true,
          },
          appearances: false,
          overrides: {
            admin: {
              condition: (_, { style }) => style === 'buttons',
            },
          },
        }),
        link({
          appearances: false,
          overrides: {
            name: 'bannerLink',
            admin: {
              condition: (_, { style }) => style === 'banner',
            },
          },
        }),
        {
          name: 'bannerImage',
          type: 'upload',
          admin: {
            condition: (_, { style }) => style === 'banner',
          },
          relationTo: 'media',
          required: true,
        },
        {
          name: 'gradientBackground',
          type: 'checkbox',
          admin: {
            condition: (_, { style }) => style === 'banner',
          },
          label: 'Enable Gradient Background',
        },
      ],
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
