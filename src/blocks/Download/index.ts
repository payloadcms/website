import { Block } from 'payload'

export const DownloadBlock: Block = {
  slug: 'downloadBlock',
  interfaceName: 'DownloadBlockType',
  labels: {
    singular: 'Download Block',
    plural: 'Download Blocks',
  },
  fields: [
    {
      name: 'downloads',
      label: 'Downloads',
      labels: {
        singular: 'Download',
        plural: 'Downloads',
      },
      type: 'array',
      minRows: 1,
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
              relationTo: 'media',
              required: true,
              admin: {
                description: 'The file to download',
                width: '50%',
              },
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Thumbnail for the download. Defaults to file for images',
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'thumbnailAppearance',
              type: 'select',
              required: true,
              defaultValue: 'cover',
              options: [
                { label: 'Cover', value: 'cover' },
                { label: 'Contain', value: 'contain' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'background',
              type: 'select',
              required: true,
              defaultValue: 'auto',
              options: [
                { label: 'Auto', value: 'auto' },
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              admin: {
                width: '50%',
              },
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
    },
  ],
}
