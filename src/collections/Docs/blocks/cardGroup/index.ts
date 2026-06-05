import type { Block } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const CardGroupBlock: Block = {
  slug: 'CardGroup',
  fields: [
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
      props: {},
    }),
    import: ({ children, markdownToLexical }) => ({
      content: markdownToLexical ? markdownToLexical({ markdown: children }) : undefined,
    }),
  },
}
