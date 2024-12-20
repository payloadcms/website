export interface TableOfContents {
  [href: string]: string
}

type HeadingType = 'primary' | 'secondary' | 'tertiary'

export type AddHeading = (anchor: string, heading: string, type: HeadingType) => void

export interface Heading {
  anchor: string
  heading: string
  type: HeadingType
}

export interface IContext {
  addHeading: AddHeading
  toc: Array<[string, Heading]>
}
