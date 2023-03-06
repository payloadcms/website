import React from 'react'
import { Providers } from '@providers'
import { fetchAnnouncements, fetchGlobals } from '@graphql'
import { GoogleAnalytics } from '@components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@components/Analytics/GoogleTagManager'
import { Announcements } from '@components/Announcements'
import { robotoMono, neueMontrealRegular, neueMontrealBold, neueMontrealItalic } from './fonts'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

import '../css/app.scss'

import classes from './layout.module.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer } = await fetchGlobals()
  const { announcements } = await fetchAnnouncements()

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />
      </head>
      <body
        className={[
          robotoMono.variable,
          neueMontrealRegular.variable,
          neueMontrealBold.variable,
          neueMontrealItalic.variable,
        ].join(' ')}
      >
        <GoogleAnalytics />
        <GoogleTagManager />
        <Providers>
          <Header {...mainMenu} />
          <div className={classes.layout}>
            {children}
            <Footer {...footer} />
            <div id="docsearch" />
          </div>
          <Announcements announcements={announcements} />
        </Providers>
      </body>
    </html>
  )
}
