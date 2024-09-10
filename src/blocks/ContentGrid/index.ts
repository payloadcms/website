import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'
import linkGroup from '../../fields/linkGroup'
import label from '../../fields/richText/label'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const ContentGrid: Block = {
  slug: 'contentGrid',
  fields: [
    blockFields({
      name: 'contentGridFields',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'style',
              label: 'Style',
              type: 'select',
              defaultValue: 'gridBelow',
              options: [
                { value: 'gridBelow', label: 'Grid Below' },
                { value: 'sideBySide', label: 'Side by Side' },
              ],
            },
            {
              name: 'showNumbers',
              type: 'checkbox',
            },
          ],
        },
        richText({
          name: 'content',
          label: 'Content',
          required: false,
        }),
        linkGroup({
          appearances: false,
          overrides: {},
        }),
        {
          name: 'cells',
          type: 'array',
          minRows: 1,
          maxRows: 8,
          fields: [
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => rootFeatures,
              }),
              required: true,
            },
          ],
        },
      ],
    }),
  ],
}
