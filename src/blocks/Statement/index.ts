import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import linkGroup from '../../fields/linkGroup'
import richText from '../../fields/richText'

export const Statement: Block = {
  slug: 'statement',
  labels: {
    singular: 'Statement',
    plural: 'Statements',
  },
  fields: [
    blockFields({
      name: 'statementFields',
      fields: [
        richText({}, { elements: ['h1'] }),
        linkGroup({
          appearances: false,
        }),
        {
          name: 'assetType',
          label: 'Asset Type',
          type: 'select',
          defaultValue: 'media',
          options: [
            {
              label: 'Media',
              value: 'media',
            },
            {
              label: 'Code',
              value: 'code',
            },
          ],
        },
        {
          name: 'media',
          label: 'Media',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData.assetType === 'media',
          },
        },
        {
          name: 'code',
          label: 'Code',
          type: 'code',
          admin: {
            condition: (_, siblingData) => siblingData.assetType === 'code',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'mediaWidth',
              label: 'Media Width',
              type: 'select',
              defaultValue: 'medium',
              admin: {
                condition: (_, siblingData) => siblingData.assetType === 'media',
                width: '50%',
              },
              options: [
                {
                  label: 'Small',
                  value: 'small',
                },
                {
                  label: 'Medium',
                  value: 'medium',
                },
                {
                  label: 'Large',
                  value: 'large',
                },
              ],
            },
            {
              name: 'backgroundGlow',
              label: 'Background Glow',
              type: 'select',
              defaultValue: 'none',
              options: [
                {
                  label: 'None',
                  value: 'none',
                },
                {
                  label: 'Colorful',
                  value: 'colorful',
                },
                {
                  label: 'White',
                  value: 'white',
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
}
