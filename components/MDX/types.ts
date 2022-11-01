export interface TableOfContents {
  [href: string]: string
}

type HeadingType = 'primary' | 'secondary' | 'tertiary'

export type AddHeading = (anchor: string, heading: string, type: HeadingType) => void

export interface Heading {
  heading: string
  anchor: string
  type: HeadingType
}

export interface IContext {
  toc: Array<[string, Heading]>
  addHeading: AddHeading
}
