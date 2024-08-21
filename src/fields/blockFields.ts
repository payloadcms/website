import type { Field, GroupField } from 'payload'

import deepMerge from '../utilities/deepMerge'

interface Args {
  fields: Field[]
  name: string
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
          fields: [
            {
              name: 'settings',
              type: 'group',
              admin: {
                hideGutter: true,
              },
              fields: [themeField],
              label: false,
            },
          ],
          label: 'Settings',
        },
        ...fields,
      ],
      label: false,
    },
    overrides,
  )
