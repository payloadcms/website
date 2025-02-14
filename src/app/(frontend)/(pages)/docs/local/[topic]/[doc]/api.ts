export type Topic = {
  docs: Doc[]
  slug: string
}

export type TopicGroup = {
  groupLabel: string
  topics: Topic[]
}

export type Doc = {
  content: string
  desc: any
  headings: any
  keywords: any
  label: any
  order: any
  slug: string
  title: any
}

export const fetchLocalDocs = (ref?: 'v2' | 'v3'): TopicGroup[] => {
  const topics =
    ref === 'v2'
      ? require('../../../../../../../docs/docs-v2.json')
      : require('../../../../../../../docs/docs-v3.json')

  return topics as TopicGroup[]
}
