// import { slateEditor } from '@payloadcms/richtext-slate'
import type { Field } from 'payload'

import label from './richText/label'
import largeBody from './richText/largeBody'

const livestreamFields: Field = {
  name: 'livestream',
  label: false,
  type: 'group',
  admin: {
    hideGutter: true,
    condition: (_, { type }) => type === 'livestream',
    style: {
      margin: 0,
      padding: 0,
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'id',
          label: 'YouTube ID',
          type: 'text',
        },
        {
          label: 'Date / Time (GMT)',
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'hideBreadcrumbs',
      type: 'checkbox',
    },
    {
      name: 'richText',
      type: 'richText',
      // editor: slateEditor({
      //   admin: {
      //     elements: ['h1', largeBody, label, 'upload'],
      //     leaves: ['bold', 'underline'],
      //   },
      // }),
    },
    {
      name: 'guests',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'link',
              type: 'text',
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}

export default livestreamFields
