import type { ArrayField } from 'payload/dist/fields/config/types'
import type { Field } from 'payload'

import deepMerge from '../utilities/deepMerge'
import type { LinkAppearances } from './link'
import link from './link'

type LinkGroupType = (options?: {
  overrides?: Partial<ArrayField>
  appearances?: LinkAppearances[] | false
  additions?: {
    npmCta?: boolean
  }
}) => Field

const additionalFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    defaultValue: 'link',
    options: [
      { value: 'link', label: 'Link' },
      { value: 'npmCta', label: 'NPM CTA' },
    ],
  },
  {
    name: 'npmCta',
    type: 'group',
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
    ],
    admin: {
      condition: (_, { type }) => Boolean(type === 'npmCta'),
    },
  },
]

const linkGroup: LinkGroupType = ({ overrides = {}, appearances, additions } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      ...(additions?.npmCta
        ? [
            ...additionalFields,
            link({
              overrides: {
                admin: {
                  condition: (_, { type }) => Boolean(type === 'link'),
                },
              },
              appearances,
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
