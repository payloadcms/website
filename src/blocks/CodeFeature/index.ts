import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import linkGroup from '../../fields/linkGroup'
import richText from '../../fields/richText'
import codeBlips from '../../fields/codeBlips'

export const CodeFeature: Block = {
  slug: 'codeFeature',
  fields: [
    blockFields({
      name: 'codeFeatureFields',
      fields: [
        {
          name: 'forceDarkBackground',
          type: 'checkbox',
          admin: {
            description: 'Check this box to force this block to have a dark background.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'alignment',
              type: 'select',
              defaultValue: 'contentCode',
              options: [
                {
                  label: 'Content + Code',
                  value: 'contentCode',
                },
                {
                  label: 'Code + Content',
                  value: 'codeContent',
                },
              ],
              admin: {
                description: 'Choose how to align the content for this block.',
                width: '50%',
              },
            },
            {
              name: 'heading',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        richText(undefined, {
          elements: ['ul', 'ol', 'link'],
        }),
        linkGroup({
          appearances: false,
        }),
        {
          name: 'codeTabs',
          type: 'array',
          minRows: 1,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'language',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    {
                      label: 'None',
                      value: 'none',
                    },
                    {
                      label: 'JavaScript',
                      value: 'js',
                    },
                    {
                      label: 'TypeScript',
                      value: 'ts',
                    },
                  ],
                },
                {
                  name: 'label',
                  label: 'Tab Label',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'code',
              type: 'code',
              required: true,
            },
            codeBlips,
          ],
        },
      ],
    }),
  ],
}
