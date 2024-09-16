import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import codeBlips from '../../fields/codeBlips'
import linkGroup from '../../fields/linkGroup'
import richText from '../../fields/richText'

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
              admin: {
                description: 'Choose how to align the content for this block.',
                width: '50%',
              },
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
        richText(),
        linkGroup({
          appearances: false,
        }),
        {
          name: 'codeTabs',
          type: 'array',
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
                  type: 'text',
                  label: 'Tab Label',
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
          minRows: 1,
        },
      ],
    }),
  ],
}
