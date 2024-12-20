import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Payload is a headless CMS and application framework built with TypeScript, Node.js, React and MongoDB',
  images: [
    {
      url: '/images/og-image.jpg',
    },
  ],
  siteName: 'Payload',
  title: 'Payload',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
