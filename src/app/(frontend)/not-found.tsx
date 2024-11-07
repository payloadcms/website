import { ErrorMessage } from '@components/ErrorMessage/index.js'
import { Footer } from '@components/Footer/index.js'
import { Header } from '@components/Header/index.js'
import { fetchGlobals } from '@data/index.js'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import React from 'react'

export default async function NotFound() {
  const { isEnabled: draft } = await draftMode()

  const getGlobals = draft
    ? fetchGlobals
    : unstable_cache(fetchGlobals, ['globals', 'mainMenu', 'footer'])

  const { footer, mainMenu } = await getGlobals()

  return (
    <React.Fragment>
      <Header {...mainMenu} />
      <div>
        <ErrorMessage />
        <div id="docsearch" />
        <Footer {...footer} />
      </div>
    </React.Fragment>
  )
}
