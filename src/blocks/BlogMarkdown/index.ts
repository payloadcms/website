import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import { BlogMarkdownField } from './Field'

export const BlogMarkdown: Block = {
  slug: 'blogMarkdown',
  labels: {
    singular: 'Markdown',
    plural: 'Markdown Blocks',
  },
  fields: [
    blockFields({
      name: 'blogMarkdownFields',
      fields: [
        {
          name: 'markdown',
          type: 'text',
          required: true,
          admin: {
            components: {
              Field: BlogMarkdownField,
            },
          },
        },
      ],
    }),
  ],
}
