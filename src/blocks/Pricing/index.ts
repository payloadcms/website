import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import link from '../../fields/link'

export const Pricing: Block = {
  slug: 'pricing',
  fields: [
    blockFields({
      name: 'pricingFields',
      fields: [
        {
          name: 'plans',
          type: 'array',
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'hasPrice',
              type: 'checkbox',
            },
            {
              name: 'enableCreatePayload',
              type: 'checkbox',
            },
            {
              name: 'price',
              label: 'Price per month',
              type: 'text',
              required: true,
              admin: {
                condition: (_, { hasPrice }) => Boolean(hasPrice),
              },
            },
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              admin: {
                condition: (_, { hasPrice }) => !Boolean(hasPrice),
              },
            },
            {
              name: 'description',
              type: 'textarea',
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
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'radio',
                  options: [
                    {
                      label: 'Check',
                      value: 'check',
                    },
                    {
                      label: 'X',
                      value: 'x',
                    },
                  ],
                },
                {
                  name: 'feature',
                  label: false,
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'disclaimer',
          type: 'text',
        },
      ],
    }),
  ],
}
