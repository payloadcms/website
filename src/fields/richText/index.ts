import type { FeatureProviderServer } from '@payloadcms/richtext-lexical'
import type { RichTextField } from 'payload'

import { BlocksFeature, SerializedBlockNode, SlateNode } from '@payloadcms/richtext-lexical'
import { UploadFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  SlateToLexicalFeature,
  convertSlateNodesToLexical,
} from '@payloadcms/richtext-lexical/migrate'
import { SerializedLabelNode } from '@root/fields/richText/features/label/LabelNode'
import { LabelFeature } from '@root/fields/richText/features/label/server'
import { SerializedLargeBodyNode } from '@root/fields/richText/features/largeBody/LargeBodyNode'
import { LargeBodyFeature } from '@root/fields/richText/features/largeBody/server'
import ObjectID from 'bson-objectid'

import link from '../link'

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
        ...defaultFeatures,
        /*SlateToLexicalFeature({
          disableHooks: true,
          converters: ({ defaultConverters }) => [
            ...defaultConverters,
            {
              converter({ converters, slateNode }) {
                return {
                  type: 'largeBody',
                  children: convertSlateNodesToLexical({
                    canContainParagraphs: false,
                    converters,
                    parentNodeType: 'largeBody',
                    slateNodes: slateNode.children as SlateNode[],
                  }),
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                } as const as SerializedLargeBodyNode
              },
              nodeTypes: ['large-body'],
            },
            {
              converter({ converters, slateNode }) {
                return {
                  type: 'label',
                  children: convertSlateNodesToLexical({
                    canContainParagraphs: false,
                    converters,
                    parentNodeType: 'label',
                    slateNodes: slateNode.children as SlateNode[],
                  }),
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                } as const as SerializedLabelNode
              },
              nodeTypes: ['label'],
            },
            {
              converter({ converters, slateNode }) {
                return {
                  type: 'block',
                  fields: {
                    blockType: 'spotlight',
                    blockName: '',
                    id: new ObjectID().toHexString(),
                    element: slateNode.element,
                    richText: convertSlateNodesToLexical({
                      canContainParagraphs: false,
                      converters,
                      parentNodeType: 'largeBody',
                      slateNodes: slateNode.children as SlateNode[],
                    }),
                  },
                  format: '',
                  version: 2,
                } as const as SerializedBlockNode<{
                  element: string
                  richText: any
                }>
              },
              nodeTypes: ['spotlight'],
            },
            {
              converter({ converters, slateNode }) {
                return {
                  type: 'block',
                  fields: {
                    blockType: 'video',
                    url: `https://www.youtube.com/watch?v=${slateNode.id}`,
                    id: new ObjectID().toHexString(),
                    blockName: '',
                  },
                  format: '',
                  version: 2,
                } as const as SerializedBlockNode<{
                  url: string
                }>
              },
              nodeTypes: ['video'],
            },
            {
              converter({ converters, slateNode }) {
                return {
                  type: 'block',
                  fields: {
                    blockType: 'br',
                    blockName: ``,
                    id: new ObjectID().toHexString(),
                  },
                  format: '',
                  version: 2,
                } as const as SerializedBlockNode
              },
              nodeTypes: ['br'],
            },
          ],
        }),*/
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
              fields: [
                {
                  name: 'ignore',
                  type: 'text',
                },
              ],
            },
          ],
        }),
        ...(additionalFeatures?.length ? additionalFeatures : []),
      ],
    }),
    required: true,
    ...overridesToMerge,
  }
}

export default richText
