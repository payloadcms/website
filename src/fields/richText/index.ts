import type { FeatureProviderServer } from '@payloadcms/richtext-lexical'
import type { RichTextField } from 'payload'

import { UploadFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import deepMerge from '../../utilities/deepMerge'
import link from '../link'

type RichText = (
  overrides?: Partial<RichTextField>,
  additionalFeatures?: FeatureProviderServer[],
) => RichTextField

const richText: RichText = (overrides = {}, additionalFeatures = []): RichTextField => {
  const overridesToMerge = overrides ? { ...overrides } : {}

  return deepMerge<RichTextField, Partial<RichTextField>>(
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'enableLink',
                    type: 'checkbox',
                    label: 'Enable Link',
                  },
                  link({
                    appearances: false,
                    disableLabel: true,
                    overrides: {
                      admin: {
                        condition: (_, data) => Boolean(data?.enableLink),
                      },
                    },
                  }),
                ],
              },
            },
          }),
          ...additionalFeatures,
        ],
      }),
      required: true,
    },
    overridesToMerge,
  )
}

export default richText
