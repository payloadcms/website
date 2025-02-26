import { blockFields } from '@root/fields/blockFields'
import { Block } from 'payload'

export const ComparisonTable: Block = {
  slug: 'comparisonTable',
  interfaceName: 'ComparisonTableType',
  fields: [
    blockFields({
      name: 'comparisonTableFields',
      fields: [
        {
          name: 'introContent',
          label: 'Intro Content',
          type: 'richText',
        },
        {
          name: 'style',
          label: 'Style',
          type: 'select',
          defaultValue: 'default',
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
          label: 'Table Header',
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
                  label: 'Title',
                  required: true,
                  admin: {
                    width: '40%',
                    placeholder: 'Compare Features',
                  },
                },
                {
                  name: 'columnOneHeader',
                  type: 'text',
                  label: 'Column One Header',
                  required: true,
                  admin: {
                    width: '30%',
                    placeholder: 'Payload',
                  },
                },
                {
                  name: 'columnTwoHeader',
                  type: 'text',
                  label: 'Column Two Header',
                  required: true,
                  admin: {
                    width: '30%',
                    placeholder: 'The other guys',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Rows',
          minRows: 1,
          maxRows: 10,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  label: false,
                  required: true,
                  admin: {
                    width: '40%',
                    placeholder: 'Feature',
                  },
                },
                {
                  name: 'columnOneCheck',
                  type: 'checkbox',
                  label: false,
                  admin: {
                    components: {
                      Field: '@root/components/TableCheckboxField',
                    },
                  },
                },
                {
                  name: 'columnOne',
                  type: 'text',
                  label: false,
                  admin: {
                    width: 'calc(30% - 50px)',
                    style: {
                      alignSelf: 'flex-end',
                    },
                  },
                },
                {
                  name: 'columnTwoCheck',
                  type: 'checkbox',
                  label: false,
                  admin: {
                    components: {
                      Field: '@root/components/TableCheckboxField',
                    },
                  },
                },
                {
                  name: 'columnTwo',
                  type: 'text',
                  label: false,
                  admin: {
                    width: 'calc(30% - 50px)',
                    style: {
                      alignSelf: 'flex-end',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
}
