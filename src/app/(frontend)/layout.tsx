import type { Metadata } from 'next'

import { GoogleAnalytics } from '@components/Analytics/GoogleAnalytics/index'
import { GoogleTagManager } from '@components/Analytics/GoogleTagManager/index'
import { PrivacyBanner } from '@components/PrivacyBanner/index'
import { payloadFavicon, payloadFaviconDark, payloadFaviconLight } from '@payloadcms/ui/assets'
import { Providers } from '@providers/index'
import { PrivacyProvider } from '@root/providers/Privacy/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { untitledSans } from './fonts'
import '../../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <PrivacyProvider>
        <head>
          <link
            href={
              typeof payloadFaviconDark === 'object' ? payloadFaviconDark.src : payloadFaviconDark
            }
            rel="icon"
            sizes="32x32"
            type="image/png"
          />
          <link
            href={
              typeof payloadFaviconLight === 'object'
                ? payloadFaviconLight.src
                : payloadFaviconLight
            }
            media="(prefers-color-scheme: dark)"
            rel="icon"
            sizes="32x32"
            type="image/png"
          />
          <link
            href={typeof payloadFavicon === 'object' ? payloadFavicon.src : payloadFavicon}
            rel="icon"
            type="image/svg+xml"
          />
          <link href={process.env.NEXT_PUBLIC_CLOUD_CMS_URL} rel="dns-prefetch" />
          <link href="https://api.github.com/repos/payloadcms/payload" rel="dns-prefetch" />
          <link href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" rel="stylesheet" />
          <link href="https://www.googletagmanager.com" rel="preconnect" />
          <link href="https://www.google-analytics.com" rel="preconnect" />
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
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
