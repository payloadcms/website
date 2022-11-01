export interface Heading {
  text: string
  level: number
  id: string
}

export interface Doc {
  content: any
  data: {
    order: number
    title: string
    label: string
    desc: string
    keywords: string
  }
  next?: {
    slug: string
    title: string
    label: string
    topic: string
  }
  headings: Heading[]
}

export interface DocPath {
  topic: string
  doc: string
}

export interface DocMeta {
  title: string
  label: string
  slug: string
  order: number
}

export interface Topic {
  docs: DocMeta[]
  slug: string
}
