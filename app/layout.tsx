import React from 'react'
import { headers, cookies } from 'next/headers'
import { fetchGlobals } from '../graphql'
import { Providers } from '../components/providers'
import { Header } from '../components/Header'
import { themeCookieName } from '../components/providers/Theme/shared'
import { themeIsValid } from '../components/providers/Theme/types'
import { Footer } from '../components/Footer'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu, footer } = await fetchGlobals()
  let theme = cookies().get(themeCookieName)?.value

  if (!themeIsValid(theme)) {
    const themeFromHeader = headers().get('Sec-CH-Prefers-Color-Scheme')
    if (themeIsValid(themeFromHeader)) theme = themeFromHeader
  }

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <title>Payload CMS</title>
      </head>
      <body>
        <Providers theme={themeIsValid(theme) ? theme : 'light'}>
          <Header {...mainMenu} />
          {children}
          <Footer {...footer} />
        </Providers>
      </body>
    </html>
  )
}
