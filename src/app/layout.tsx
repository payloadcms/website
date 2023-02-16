import React from 'react'
import { fetchGlobals } from '@graphql'
import { Providers } from '@providers'

import { HeaderObserver } from '@components/HeaderObserver'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { neueMontrealBold, neueMontrealItalic, neueMontrealRegular, robotoMono } from './fonts'

import '../css/app.scss'

import classes from './layout.module.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer, templates } = await fetchGlobals()

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
        <Providers templates={templates}>
          <Header {...mainMenu} />
          <div className={classes.layout}>
            <HeaderObserver>{children}</HeaderObserver>
            <Footer {...footer} />
            <div id="docsearch" />
          </div>
        </Providers>
      </body>
    </html>
  )
}
