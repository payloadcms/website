// import { slateEditor } from '@payloadcms/richtext-slate'
import type { Field } from 'payload'

const livestreamFields: Field = {
  name: 'livestream',
  type: 'group',
  admin: {
    condition: (_, { type }) => type === 'livestream',
    hideGutter: true,
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
          type: 'text',
          label: 'YouTube ID',
        },
        {
          name: 'date',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          label: 'Date / Time (GMT)',
          required: true,
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
  label: false,
}

export default livestreamFields
