type TopicOrder = {
  [version: string]: {
    groupLabel: string
    topics: string[]
  }[]
}

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
      ],
    },
    {
      groupLabel: 'Ecosystem',
      topics: ['Plugins', 'Examples', 'Integrations'],
    },
    {
      groupLabel: 'Deployment',
      topics: ['Cloud', 'Production'],
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
        'Authentication',
        'Rich-Text',
        'Live-Preview',
        'Versions',
        'Upload',
        'Email',
        'Jobs-Queue',
        'TypeScript',
      ],
    },
    {
      groupLabel: 'Ecosystem',
      topics: ['Plugins', 'Examples', 'Integrations'],
    },
    {
      groupLabel: 'Deployment',
      topics: ['Cloud', 'Production'],
    },
  ],
}
