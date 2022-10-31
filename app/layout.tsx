import React from 'react'
import { headers, cookies } from 'next/headers'
import { fetchGlobals } from '../graphql'
import { Providers } from '../components/providers'
import { Header } from '../components/Header'
import { themeCookieName } from '../components/providers/Theme/shared'
import { Theme } from '../components/providers/Theme/types'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu } = await fetchGlobals()
  let theme = cookies().get(themeCookieName)?.value as Theme

  if (!theme) {
    const themeFromHeader = headers().get('Sec-CH-Prefers-Color-Scheme')
    if (themeFromHeader) theme = themeFromHeader as Theme
  }

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <Providers theme={theme}>
          <Header {...mainMenu} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
