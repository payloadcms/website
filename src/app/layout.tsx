import React from 'react'
import { fetchGlobals } from '@graphql'
import { Providers } from '@providers'
import { Metadata } from 'next'

import { GoogleAnalytics } from '@components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@components/Analytics/GoogleTagManager'
import { HeaderObserver } from '@components/HeaderObserver'
import { TopBar } from '@components/TopBar'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { neueMontrealBold, neueMontrealItalic, neueMontrealRegular, robotoMono } from './fonts'

import '../css/app.scss'

import classes from './layout.module.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer, topBar, templates } = await fetchGlobals()

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.svg" />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_CLOUD_CMS_URL} />
        <link rel="dns-prefetch" href="https://api.github.com/repos/payloadcms/payload" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />
        <GoogleAnalytics />
      </head>
      <body
        className={[
          robotoMono.variable,
          neueMontrealRegular.variable,
          neueMontrealBold.variable,
          neueMontrealItalic.variable,
        ].join(' ')}
      >
        <GoogleTagManager />
        <Providers templates={templates}>
          <TopBar {...topBar} />
          <Header {...mainMenu} />
          <div className={classes.layout}>
            <HeaderObserver pullUp>{children}</HeaderObserver>
            <Footer {...footer} />
            <div id="docsearch" />
          </div>
        </Providers>
      </body>
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
