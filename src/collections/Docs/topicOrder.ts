// UPDATE THIS FILE WHEN ADDING A NEW TOPIC FOR DOCS

import type { DocVersion } from './branchForVersion'

type TopicOrder = Record<
  DocVersion,
  {
    groupLabel: string
    topics: string[]
  }[]
>

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
  v3: [
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
  ],
  v4: [
    {
      groupLabel: 'Basics',
      topics: [
        'Getting-Started',
        'Migration-Guide',
        'Configuration',
        'Database',
        'Fields',
        'Access-Control',
        'Hooks',
      ],
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
        'Hierarchy',
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
  ],
}
