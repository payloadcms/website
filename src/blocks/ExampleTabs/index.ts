import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

const CodeExampleBlock: Block = {
  slug: 'CodeExampleBlock',
  interfaceName: 'CodeExampleBlock',
  labels: {
    singular: 'Code Example',
    plural: 'Code Examples',
  },
  fields: [
    {
      name: 'code',
      type: 'code',
      required: true,
    },
  ],
}

const MediaExampleBlock: Block = {
  slug: 'MediaExampleBlock',
  interfaceName: 'MediaExampleBlock',
  labels: {
    singular: 'Media Example',
    plural: 'Media Examples',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

export const ExampleTabs: Block = {
  slug: 'exampleTabs',
  labels: {
    singular: 'Example Tabs',
    plural: 'Example Tabs',
  },
  interfaceName: 'ExampleTabsBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => rootFeatures,
      }),
    },
    {
      name: 'tabs',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => rootFeatures,
          }),
        },
        {
          name: 'examples',
          type: 'blocks',
          minRows: 1,
          maxRows: 2,
          required: true,
          blocks: [CodeExampleBlock, MediaExampleBlock],
        },
      ],
    },
  ],
}
