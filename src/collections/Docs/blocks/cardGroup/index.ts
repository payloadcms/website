import type { Block } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const CardGroupBlock: Block = {
  slug: 'CardGroup',
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Compact', value: 'compact' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: () => [BlocksFeature({ blocks: ['Card'] })],
      }),
    },
  ],
  interfaceName: 'CardGroupBlock',
  jsx: {
    export: ({ fields, lexicalToMarkdown }) => ({
      children: lexicalToMarkdown ? lexicalToMarkdown({ editorState: fields.content }) : '',
      props: {
        variant: fields.variant,
      },
    }),
    import: ({ children, markdownToLexical, props }) => ({
      content: markdownToLexical ? markdownToLexical({ markdown: children }) : undefined,
      variant: props.variant,
    }),
  },
}
