import { createServerFeature } from '@payloadcms/richtext-lexical'
import { LargeBodyNode } from '@root/fields/richText/features/largeBody/LargeBodyNode'

export const LargeBodyFeature = createServerFeature({
  feature: {
    ClientFeature: '@root/fields/richText/features/largeBody/client#LargeBodyFeatureClient',
    nodes: [
      {
        node: LargeBodyNode,
      },
    ],
  },
  key: 'largeBody',
})
