import React from 'react'
import { Providers } from '@providers/index.js'
import { Metadata } from 'next'

import { GoogleAnalytics } from '@components/Analytics/GoogleAnalytics/index.js'
import { GoogleTagManager } from '@components/Analytics/GoogleTagManager/index.js'
import { PrivacyBanner } from '@components/PrivacyBanner/index.js'
import { PrivacyProvider } from '@root/providers/Privacy/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { untitledSans } from './fonts.js'
import { GeistMono } from 'geist/font/mono'

import '../../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <PrivacyProvider>
        <head>
          <link rel="icon" href="/images/favicon.svg" />
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_CLOUD_CMS_URL} />
          <link rel="dns-prefetch" href="https://api.github.com/repos/payloadcms/payload" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <GoogleAnalytics />
        </head>
        <body className={[GeistMono.variable, untitledSans.variable].join(' ')}>
          <GoogleTagManager />
          <Providers>
            {children}
            <PrivacyBanner />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://payloadcms.com'),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  openGraph: mergeOpenGraph(),
}
