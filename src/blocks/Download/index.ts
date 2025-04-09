import type { Block } from 'payload'

export const DownloadBlock: Block = {
  slug: 'downloadBlock',
  fields: [
    {
      name: 'downloads',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'file',
              type: 'upload',
              admin: {
                description: 'The file to download',
                width: '50%',
              },
              relationTo: 'media',
              required: true,
            },
            {
              name: 'thumbnail',
              type: 'upload',
              admin: {
                description: 'Thumbnail for the download. Defaults to file for images',
                width: '50%',
              },
              relationTo: 'media',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'thumbnailAppearance',
              type: 'select',
              admin: {
                width: '50%',
              },
              defaultValue: 'cover',
              options: [
                { label: 'Cover', value: 'cover' },
                { label: 'Contain', value: 'contain' },
              ],
              required: true,
            },
            {
              name: 'background',
              type: 'select',
              admin: {
                width: '50%',
              },
              defaultValue: 'auto',
              options: [
                { label: 'Auto', value: 'auto' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              required: true,
            },
          ],
        },
        {
          name: 'copyToClipboard',
          type: 'checkbox',
        },
        {
          name: 'copyToClipboardText',
          type: 'code',
          admin: {
            condition: (_, siblingData) => siblingData.copyToClipboard,
          },
        },
      ],
      label: 'Downloads',
      labels: {
        plural: 'Downloads',
        singular: 'Download',
      },
      minRows: 1,
    },
  ],
  interfaceName: 'DownloadBlockType',
  labels: {
    plural: 'Download Blocks',
    singular: 'Download Block',
  },
}
