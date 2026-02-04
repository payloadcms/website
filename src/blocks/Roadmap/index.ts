import type { Block } from 'payload'

import { blockFields } from '../../fields/blockFields'
import richText from '../../fields/richText'

export const Roadmap: Block = {
  slug: 'roadmap',
  fields: [
    blockFields({
      name: 'roadmapFields',
      fields: [
        richText({
          name: 'richText',
          admin: {
            description:
              'Add introductory content above the roadmap. This will be displayed before the roadmap items.',
          },
          label: 'Content',
          required: false,
        }),
        {
          name: 'showPriorityBadges',
          type: 'checkbox',
          admin: {
            description:
              'Display P0, P1, P2, or TBD badges on each card. Recommended when not grouping by priority.',
          },
          defaultValue: false,
          label: 'Show priority badges on cards?',
        },
      ],
    }),
  ],
  interfaceName: 'RoadmapBlock',
}
