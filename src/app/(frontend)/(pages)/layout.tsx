import { Footer } from '@components/Footer/index.js'
import { Header } from '@components/Header/index.js'
import { fetchGlobals } from '@data/index.js'
import React from 'react'

export const dynamic = 'force-static'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { footer, mainMenu } = await fetchGlobals()

  return (
    <React.Fragment>
      <Header {...mainMenu} />
      <div>
        {children}
        <div id="docsearch" />
        <Footer {...footer} />
      </div>
    </React.Fragment>
  )
}
