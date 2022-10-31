import React from 'react'
import { fetchGlobals } from '../graphql'
import { Providers } from '../components/providers'
import { Header } from '../components/Header'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu } = await fetchGlobals()

  // 1. Get cookies from headers to determine if there is a color scheme set
  // 2. If no theme from cookies, retrieve user agent and determine what color scheme is preferred
  // 3. Set theme on html with result
  // 4. Pass the resulting color scheme to the Providers component and use it to instantiate state

  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <Providers>
          <Header {...mainMenu} />
          {children}
        </Providers>
      </body>
    </html>
  )
}
