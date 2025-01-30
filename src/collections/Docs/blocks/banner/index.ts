import type { Block } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { bannerTypes } from '../shared'

export const BannerBlock: Block = {
  slug: 'Banner',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'default',
      options: Object.entries(bannerTypes).map(([key, value]) => ({
        label: value,
        value: key,
      })),
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },
  ],
  interfaceName: 'BannerBlock',
  jsx: {
    export: ({ fields, lexicalToMarkdown }) => {
      const props: any = {}
      if (fields.type) {
        props.type = fields.type
      }

      return {
        children: lexicalToMarkdown ? lexicalToMarkdown({ editorState: fields.content }) : '',
        props,
      }
    },
    import: ({ children, markdownToLexical, props }) => {
      return {
        type: props?.type ?? 'success',
        content: markdownToLexical ? markdownToLexical({ markdown: children }) : undefined,
      }
    },
  },
}
