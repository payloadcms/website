import type { Field, GroupField } from 'payload'

import deepMerge from '../utilities/deepMerge'

interface Args {
  fields: Field[]
  name: string
  overrides?: Partial<GroupField>
}

export const themeField: (width?: number) => Field = (width) => ({
  name: 'theme',
  type: 'select',
  admin: {
    description: 'Leave blank for system default',
    width: width ? `${width}%` : '50%',
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
})

export const backgroundField: Field = {
  name: 'background',
  type: 'select',
  admin: {
    width: '50%',
  },
  options: [
    {
      label: 'Solid',
      value: 'solid',
    },
    {
      label: 'Transparent',
      value: 'transparent',
    },
    {
      label: 'Gradient Up',
      value: 'gradientUp',
    },
    {
      label: 'Gradient Down',
      value: 'gradientDown',
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
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [themeField(), backgroundField],
                },
              ],
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
