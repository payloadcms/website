// UPDATE THIS FILE WHEN ADDING A NEW TOPIC FOR DOCS

import type { DocVersion } from './branchForVersion'

type TopicOrder = Record<
  DocVersion,
  {
    groupLabel: string
    topics: string[]
  }[]
>

const v3TopicOrder: TopicOrder['v3'] = [
  {
    groupLabel: 'Basics',
    topics: ['Getting-Started', 'Configuration', 'Database', 'Fields', 'Access-Control', 'Hooks'],
  },
  {
    groupLabel: 'Managing Data',
    topics: ['Local-API', 'REST-API', 'GraphQL', 'Queries'],
  },
  {
    groupLabel: 'Features',
    topics: [
      'Admin',
      'Custom-Components',
      'UI-Components',
      'Authentication',
      'Rich-Text',
      'Live-Preview',
      'Versions',
      'Upload',
      'Folders',
      'Email',
      'Jobs-Queue',
      'Query-Presets',
      'Trash',
      'Troubleshooting',
      'TypeScript',
    ],
  },
  {
    groupLabel: 'Ecosystem',
    topics: ['Plugins', 'Ecommerce', 'Examples', 'Integrations'],
  },
  {
    groupLabel: 'Deployment',
    topics: ['Production', 'Performance'],
  },
]

const v4TopicOrder: TopicOrder['v4'] = v3TopicOrder.map(({ groupLabel, topics }) => {
  if (groupLabel === 'Basics') {
    return {
      groupLabel,
      topics: topics.flatMap((topic) =>
        topic === 'Getting-Started' ? [topic, 'Migration-Guide'] : topic,
      ),
    }
  }

  if (groupLabel === 'Features') {
    return {
      groupLabel,
      topics: topics.flatMap((topic) => (topic === 'Folders' ? [topic, 'Hierarchy'] : topic)),
    }
  }

  return { groupLabel, topics }
})

export const topicOrder: TopicOrder = {
  v2: [
    {
      groupLabel: 'Basics',
      topics: ['Getting-Started', 'Configuration', 'Database', 'Fields', 'Access-Control', 'Hooks'],
    },
    {
      groupLabel: 'Managing Data',
      topics: ['Local-API', 'REST-API', 'GraphQL', 'Queries'],
    },
    {
      groupLabel: 'Features',
      topics: [
        'Admin',
        'Authentication',
        'Rich-Text',
        'Live-Preview',
        'Versions',
        'Upload',
        'Email',
        'TypeScript',
        'Experimental',
      ],
    },
    {
      groupLabel: 'Ecosystem',
      topics: ['Plugins', 'Examples', 'Integrations'],
    },
    {
      groupLabel: 'Deployment',
      topics: ['Production'],
    },
  ],
  v3: v3TopicOrder,
  v4: v4TopicOrder,
}
