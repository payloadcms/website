import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import ClientLayout from './client_layout'

export const metadata: Metadata = {
  title: {
    template: '%s | Payload Cloud',
    default: 'Payload Cloud',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload CMS',
    description: 'The Node & React TypeScript Headless CMS',
    creator: '@payloadcms',
  },
  // TODO: Add cloud graphic
  openGraph: mergeOpenGraph({
    images: [
      {
        url: '/images/og-image.jpg',
      },
    ],
  }),
}

export default async ({ children }) => {
  return <ClientLayout>{children}</ClientLayout>
}
