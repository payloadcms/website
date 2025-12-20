import type { Field, GroupField } from 'payload'

import deepMerge from '../utilities/deepMerge'

interface Args {
  fields: Field[]
  name: string
  overrides?: Partial<GroupField>
}

// Generate short dbName from camelCase name (e.g., 'caseStudyParallaxFields' -> 'cspf')
const generateShortDbName = (name: string): string => {
  const matches = name.match(/[A-Z]?[a-z]+/g)
  if (!matches) return name.slice(0, 4)
  return matches.map((word) => word[0].toLowerCase()).join('')
}

export const themeField: (width?: number) => Field = (width) => ({
  name: 'theme',
  type: 'select',
  dbName: 'thm',
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
  dbName: 'bg',
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
      dbName: generateShortDbName(name),
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
              dbName: 'set',
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
