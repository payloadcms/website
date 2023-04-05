import { Metadata } from 'next'

export default async ({ children }) => {
  return children
}

export const metadata: Metadata = {
  title: 'Blog | Payload CMS',
  description:
    'The official Payload CMS blog. Read about the product and keep up to date with new features.',
}
