import React from 'react'
import { Providers } from '@providers'
import { defaultTheme, themeLocalStorageKey } from '@providers/Theme/shared'
import { Metadata } from 'next'
import Script from 'next/script'

import { GoogleAnalytics } from '@components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@components/Analytics/GoogleTagManager'
import { PrivacyBanner } from '@components/PrivacyBanner'
import { TopBar } from '@components/TopBar'
import { fetchGlobals } from '@root/app/_graphql'
import { PrivacyProvider } from '@root/providers/Privacy'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { robotoMono, untitledSans } from './fonts'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer, topBar } = await fetchGlobals()

  return (
    <html lang="en" suppressHydrationWarning>
      <PrivacyProvider>
        <head>
          {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
          <Script
            id="theme-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function () {
              function getImplicitPreference() {
                var mediaQuery = '(prefers-color-scheme: dark)'
                var mql = window.matchMedia(mediaQuery)
                var hasImplicitPreference = typeof mql.matches === 'boolean'

                if (hasImplicitPreference) {
                  return mql.matches ? 'dark' : 'light'
                }

                return null
              }

              function themeIsValid(theme) {
                return theme === 'light' || theme === 'dark'
              }

              var themeToSet = '${defaultTheme}'
              var preference = window.localStorage.getItem('${themeLocalStorageKey}')

              if (themeIsValid(preference)) {
                themeToSet = preference
              } else {
                var implicitPreference = getImplicitPreference()

                if (implicitPreference) {
                  themeToSet = implicitPreference
                }
              }

              document.documentElement.setAttribute('data-theme', themeToSet)
            })()`,
            }}
          />
          <link rel="icon" href="/images/favicon.svg" />
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_CLOUD_CMS_URL} />
          <link rel="dns-prefetch" href="https://api.github.com/repos/payloadcms/payload" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <GoogleAnalytics />
        </head>
        <body className={[robotoMono.variable, untitledSans.variable].join(' ')}>
          <GoogleTagManager />
          <Providers>
            <Header {...mainMenu} />
            <div>
              {children}
              <Footer {...footer} />
              <div id="docsearch" />
              <PrivacyBanner />
            </div>
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
