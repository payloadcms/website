import type { Block } from 'payload'

import { blockFields } from '@root/fields/blockFields'

export const ComparisonTable: Block = {
  slug: 'comparisonTable',
  fields: [
    blockFields({
      name: 'comparisonTableFields',
      fields: [
        {
          name: 'introContent',
          type: 'richText',
          label: 'Intro Content',
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'default',
          label: 'Style',
          options: [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Centered',
              value: 'centered',
            },
          ],
        },
        {
          name: 'header',
          type: 'group',
          admin: {
            hideGutter: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'tableTitle',
                  type: 'text',
                  admin: {
                    placeholder: 'Compare Features',
                    width: '40%',
                  },
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'columnOneHeader',
                  type: 'text',
                  admin: {
                    placeholder: 'Payload',
                    width: '30%',
                  },
                  label: 'Column One Header',
                  required: true,
                },
                {
                  name: 'columnTwoHeader',
                  type: 'text',
                  admin: {
                    placeholder: 'The other guys',
                    width: '30%',
                  },
                  label: 'Column Two Header',
                  required: true,
                },
              ],
            },
          ],
          label: 'Table Header',
        },
        {
          name: 'rows',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  admin: {
                    placeholder: 'Feature',
                    width: '40%',
                  },
                  label: false,
                  required: true,
                },
                {
                  name: 'columnOneCheck',
                  type: 'checkbox',
                  admin: {
                    components: {
                      Field: '@root/components/TableCheckboxField',
                    },
                  },
                  label: false,
                },
                {
                  name: 'columnOne',
                  type: 'text',
                  admin: {
                    style: {
                      alignSelf: 'flex-end',
                    },
                    width: 'calc(30% - 50px)',
                  },
                  label: false,
                },
                {
                  name: 'columnTwoCheck',
                  type: 'checkbox',
                  admin: {
                    components: {
                      Field: '@root/components/TableCheckboxField',
                    },
                  },
                  label: false,
                },
                {
                  name: 'columnTwo',
                  type: 'text',
                  admin: {
                    style: {
                      alignSelf: 'flex-end',
                    },
                    width: 'calc(30% - 50px)',
                  },
                  label: false,
                },
              ],
            },
          ],
          label: 'Rows',
          maxRows: 10,
          minRows: 1,
        },
      ],
    }),
  ],
  interfaceName: 'ComparisonTableType',
}
