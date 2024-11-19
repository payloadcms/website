import type { Block } from 'payload'

const CodeExampleBlock: Block = {
  slug: 'CodeExampleBlock',
  fields: [
    {
      name: 'code',
      type: 'code',
      required: true,
    },
  ],
  interfaceName: 'CodeExampleBlock',
  labels: {
    plural: 'Code Examples',
    singular: 'Code Example',
  },
}

const MediaExampleBlock: Block = {
  slug: 'MediaExampleBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  interfaceName: 'MediaExampleBlock',
  labels: {
    plural: 'Media Examples',
    singular: 'Media Example',
  },
}

export const ExampleTabs: Block = {
  slug: 'exampleTabs',
  fields: [
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'tabs',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'examples',
          type: 'blocks',
          blocks: [CodeExampleBlock, MediaExampleBlock],
          maxRows: 2,
          minRows: 1,
          required: true,
        },
      ],
      minRows: 1,
      required: true,
    },
  ],
  interfaceName: 'ExampleTabsBlock',
  labels: {
    plural: 'Example Tabs',
    singular: 'Example Tabs',
  },
}
