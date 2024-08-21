import type { FeatureProviderServer } from '@payloadcms/richtext-lexical'
import type { RichTextField } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

type RichText = (
  overrides?: Partial<RichTextField>,
  additionalFeatures?: FeatureProviderServer[],
) => RichTextField

const richText: RichText = (overrides = {}, additionalFeatures = []): RichTextField => {
  const overridesToMerge = overrides ? overrides : {}

  return {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ defaultFeatures, rootFeatures }) => [
        ...rootFeatures,
        ...(additionalFeatures?.length ? additionalFeatures : []),
      ],
    }),
    required: true,
    ...overridesToMerge,
  }
}

export default richText
