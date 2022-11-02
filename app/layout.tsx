import React from 'react'
import { robotoMono, neueMontrealRegular, neueMontrealBold, neueMontrealItalic } from './fonts'
import { fetchGlobals } from '../graphql'
import { Providers } from '../components/providers'
import { Header } from '../components/Header'
import { setInitialTheme } from '../components/providers/Theme/shared'
import { Footer } from '../components/Footer'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer } = await fetchGlobals()

  return (
    <html lang="en" data-theme="dark">
      <head>
        <title>Payload CMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        ></link>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body
        className={[
          robotoMono.variable,
          neueMontrealRegular.variable,
          neueMontrealBold.variable,
          neueMontrealItalic.variable,
        ].join(' ')}
      >
        <Providers>
          <Header {...mainMenu} />
          {children}
          <Footer {...footer} />
          <div id="docsearch" />
        </Providers>
      </body>
    </html>
  )
}
