import React from 'react'
import { fetchGlobals } from '../graphql'
import { Providers } from '../components/providers'
import { Header } from '../components/Header'

import '../css/app.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mainMenu } = await fetchGlobals()

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
