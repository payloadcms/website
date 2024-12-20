import type { ArrayField, Field } from 'payload'

import type { LinkAppearances } from './link'

import deepMerge from '../utilities/deepMerge'
import link from './link'

type LinkGroupType = (options?: {
  additions?: {
    npmCta?: boolean
  }
  appearances?: false | LinkAppearances[]
  overrides?: Partial<ArrayField>
}) => Field

const additionalFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    defaultValue: 'link',
    options: [
      { label: 'Link', value: 'link' },
      { label: 'NPM CTA', value: 'npmCta' },
    ],
  },
  {
    name: 'npmCta',
    type: 'group',
    admin: {
      condition: (_, { type }) => Boolean(type === 'npmCta'),
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
    ],
  },
]

const linkGroup: LinkGroupType = ({ additions, appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      ...(additions?.npmCta
        ? [
            ...additionalFields,
            link({
              appearances,
              overrides: {
                admin: {
                  condition: (_, { type }) => Boolean(type === 'link'),
                },
              },
            }),
          ]
        : [
            link({
              appearances,
            }),
          ]),
    ],
  }

  return deepMerge(generatedLinkGroup, overrides)
}

export default linkGroup
