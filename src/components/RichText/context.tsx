'use client'
import { createContext, use } from 'react'

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

export const RichTextContext = createContext<IContext>({
  addHeading: () => null,
  toc: [] as Array<[string, Heading]>,
})

export const useRichText = (): IContext => use(RichTextContext)
