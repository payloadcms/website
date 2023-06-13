export interface Example {
  slug: string
  req: {
    headers?: boolean | string
    body?: any
    query?: boolean | string
    credentials?: boolean
  }
  res: {
    paginated?: boolean
    data?: any
  }
  drawerContent?: React.ReactNode | string
}

export interface Data {
  operation: string
  description: string
  method: string
  path: string
  example: Example
}

export interface Props {
  data: Data[]
  inDrawer?: boolean
}
