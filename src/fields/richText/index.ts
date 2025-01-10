import type { FeatureProviderServer } from '@payloadcms/richtext-lexical'
import type { RichTextField } from 'payload'

type RichText = (
  overrides?: Partial<RichTextField>,
  additionalFeatures?: FeatureProviderServer[],
) => RichTextField

const richText: RichText = (overrides = {}): RichTextField => {
  const overridesToMerge = overrides ? overrides : {}

  return {
    name: 'richText',
    type: 'richText',
    required: true,
    ...overridesToMerge,
  }
}

export default richText
