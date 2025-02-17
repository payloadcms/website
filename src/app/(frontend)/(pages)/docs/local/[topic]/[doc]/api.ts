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
  let topics: TopicGroup[] = []

  if (process.env.NODE_ENV !== 'production') {
    try {
      topics =
        ref === 'v2'
          ? require('../../../../../../../docs/docs-v2.json')
          : require('../../../../../../../docs/docs-v3.json')
    } catch (_err) {
      console.error('Error fetching local docs', _err) // eslint-disable-line no-console
    }
  }

  return topics
}
