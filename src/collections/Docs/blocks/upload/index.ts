import type { Block } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const UploadBlock: Block = {
  slug: 'Upload',
  fields: [
    {
      name: 'src',
      type: 'text',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },
  ],
  interfaceName: 'UploadBlock',
}
