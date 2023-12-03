export interface Heading {
  text: string
  level: number
  id: string
}

export interface Doc {
  content: any // eslint-disable-line
  order: number
  title: string
  label: string
  desc: string
  keywords: string
  headings: Heading[]
  slug?: string
  path?: string
}

export type DocOrTopic =
  | Doc
  | {
      content?: any // eslint-disable-line
      order?: number
      title?: string
      label?: string
      desc?: string
      keywords?: string
      headings?: Heading[]
      docs: Doc[]
      slug?: string
      path?: string
    }

export interface NextDoc {
  slug: string
  title: string
  label: string
  topic: string
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
  docs?: DocMeta[]
  /** Path, not including the slug, ends with "/" **/
  path?: string
}

export interface Topic {
  docs: DocMeta[]
  slug: string
  /** Path, not including the slug, ends with "/" **/
  path?: string
}
