export interface Heading {
  anchor: string
  id: string
  level: number
  text: string
}

export interface Doc {
  content: any // eslint-disable-line
  desc: string
  headings: Heading[]
  keywords: string
  label: string
  order: number
  title: string
}

export interface NextDoc {
  label: string
  slug: string
  title: string
  topic: string
}

export interface DocPath {
  doc: string
  topic: string
}

export interface DocMeta {
  label: string
  order: number
  slug: string
  title: string
}

export interface Topic {
  docs: DocMeta[]
  slug: string
}
