import React from 'react'
import { fetchGlobals } from '../graphql'
import { Providers } from '../components/providers'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer } = await fetchGlobals()

  return (
    <html lang="en" data-theme={'light'}>
      <head>
        <title>Payload CMS</title>
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
