import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  siteName: 'Payload CMS',
  title: 'Payload CMS',
  description: 'The Node & React TypeScript Headless CMS',
  images: [
    {
      url: 'https://payloadcms.com/images/og-image.jpg',
    },
  ],
}

export const mergeOpenGraph = (og: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
  }
}
