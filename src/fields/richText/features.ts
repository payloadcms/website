import type { FeatureProviderServer } from '@payloadcms/richtext-lexical'

import { BlocksFeature } from '@payloadcms/richtext-lexical'
import { LabelFeature } from '@root/fields/richText/features/label/server'
import { LargeBodyFeature } from '@root/fields/richText/features/largeBody/server'

export const features: FeatureProviderServer<any, any, any>[] = [
  LabelFeature(),
  LargeBodyFeature(),
  BlocksFeature({
    blocks: [
      {
        slug: 'spotlight',
        fields: [
          {
            name: 'element',
            type: 'select',
            options: [
              {
                label: 'H1',
                value: 'h1',
              },
              {
                label: 'H2',
                value: 'h2',
              },
              {
                label: 'H3',
                value: 'h3',
              },
              {
                label: 'Paragraph',
                value: 'p',
              },
            ],
          },
          {
            name: 'richText',
            type: 'richText',
          },
        ],
      },
      {
        slug: 'video',
        fields: [
          {
            name: 'url',
            type: 'text',
          },
        ],
      },
      {
        slug: 'br',
        fields: [],
      },
    ],
  }),
]
