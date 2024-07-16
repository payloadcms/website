import type { Field, GroupField } from 'payload'

import deepMerge from '../utilities/deepMerge'

interface Args {
  name: string
  fields: Field[]
  overrides?: Partial<GroupField>
}

export const themeField: Field = {
  name: 'theme',
  type: 'select',
  admin: {
    description: 'Leave blank for system default',
  },
  options: [
    {
      label: 'Light',
      value: 'light',
    },
    {
      label: 'Dark',
      value: 'dark',
    },
  ],
}

export const blockFields = ({ name, fields, overrides }: Args): Field =>
  deepMerge(
    {
      name,
      label: false,
      type: 'group',
      admin: {
        hideGutter: true,
        style: {
          margin: 0,
          padding: 0,
        },
      },
      fields: [
        {
          type: 'collapsible',
          label: 'Settings',
          fields: [
            {
              type: 'group',
              label: false,
              admin: {
                hideGutter: true,
              },
              name: 'settings',
              fields: [themeField],
            },
          ],
        },
        ...fields,
      ],
    },
    overrides,
  )
