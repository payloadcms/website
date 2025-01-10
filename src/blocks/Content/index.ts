import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'

export const Content: Block = {
  slug: 'content',
  fields: [
    blockFields({
      name: 'contentFields',
      fields: [
        {
          name: 'useLeadingHeader',
          type: 'checkbox',
          label: 'Use Leading Header',
        },
        richText({
          name: 'leadingHeader',
          admin: {
            condition: (_, siblingData) => siblingData.useLeadingHeader,
          },
          label: 'Leading Header',
        }),
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'oneColumn',
          options: [
            {
              label: 'One Column',
              value: 'oneColumn',
            },
            {
              label: 'Two Columns',
              value: 'twoColumns',
            },
            {
              label: 'Two Thirds + One Third',
              value: 'twoThirdsOneThird',
            },
            {
              label: 'Half + Half',
              value: 'halfAndHalf',
            },
            {
              label: 'Three Columns',
              value: 'threeColumns',
            },
          ],
        },
        richText({
          name: 'columnOne',
        }),
        richText({
          name: 'columnTwo',
          admin: {
            condition: (_, siblingData) =>
              ['halfAndHalf', 'threeColumns', 'twoColumns', 'twoThirdsOneThird'].includes(
                siblingData.layout,
              ),
          },
        }),
        richText({
          name: 'columnThree',
          admin: {
            condition: (_, siblingData) => siblingData.layout === 'threeColumns',
          },
        }),
      ],
    }),
  ],
}
