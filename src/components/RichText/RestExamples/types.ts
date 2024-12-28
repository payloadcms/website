import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export interface Example {
  drawerContent?: DefaultTypedEditorState
  req: {
    body?: any
    credentials?: boolean
    headers?: boolean | string
    query?: boolean | string
  }
  res: {
    data?: any
    paginated?: boolean
  }
  slug: string
}

export interface Data {
  description: string
  example: Example
  method: string
  operation: string
  path: string
}

export interface Props {
  data: Data[]
  inDrawer?: boolean
}
