import type { Block } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const RestExamplesBlock: Block = {
  slug: 'RestExamples',
  fields: [
    {
      name: 'data',
      type: 'array',
      fields: [
        {
          name: 'operation',
          type: 'text',
        },
        {
          name: 'method',
          type: 'text',
        },
        {
          name: 'path',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'example',
          type: 'group',
          fields: [
            {
              name: 'slug',
              type: 'text',
            },
            {
              name: 'req',
              type: 'json',
            },
            {
              name: 'res',
              type: 'json',
            },
            {
              name: 'drawerContent',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({
                    blocks: ['Code'],
                  }),
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
  interfaceName: 'RestExamplesBlock',
  jsx: {
    export: ({ fields, lexicalToMarkdown }) => {
      return {
        props: {
          data: fields.data.map((item) => {
            return {
              ...item,
              example: {
                ...item.example,
                drawerContent: item.example.drawerContent
                  ? lexicalToMarkdown({ editorState: item.example.drawerContent })
                  : undefined,
              },
            }
          }),
        },
      }
    },
    import: ({ children, markdownToLexical, props }) => {
      return {
        data: props.data.map((item) => {
          return {
            ...item,
            example: {
              ...item.example,
              drawerContent: item.example.drawerContent
                ? markdownToLexical({ markdown: item.example.drawerContent })
                : undefined,
            },
          }
        }),
      }
    },
  },
}
