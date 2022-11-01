import React from 'react'
import { fetchGlobals } from '../graphql'
import { Providers } from '../components/providers'
import { Header } from '../components/Header'
// import { themeCookieName } from '../components/providers/Theme/shared'
import { Footer } from '../components/Footer'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer } = await fetchGlobals()

  return (
    <html lang="en" data-theme="light">
      <head>
        <title>Payload CMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <Providers theme={'light'}>
          <Header {...mainMenu} />
          {children}
          <Footer {...footer} />
        </Providers>
      </body>
    </html>
  )
}
