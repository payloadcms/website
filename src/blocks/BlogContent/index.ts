import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'

export const BlogContent: Block = {
  slug: 'blogContent',
  fields: [
    blockFields({
      name: 'blogContentFields',
      fields: [richText()],
    }),
  ],
}
