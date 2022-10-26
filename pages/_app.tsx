import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { AdminBar } from '../components/AdminBar'
import { Header } from '../components/Header'
import { ThemePreferenceProvider, ThemeProvider } from '../components/providers/Theme'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalProvider, ModalContainer } from '@faceless-ui/modal'
import { Footer, MainMenu } from '../payload-types'

import '../css/app.scss'

const PayloadApp = (
  appProps: AppProps<{
    collection?: string
    id?: string
    preview?: boolean
    page: {
      id: string
    }
    mainMenu: MainMenu
    footer: Footer
  }>,
): React.ReactElement => {
  const { Component, pageProps } = appProps

  const { collection, preview, page: { id: pageID } = {} } = pageProps

  const router = useRouter()

  const onPreviewExit = useCallback(() => {
    const exit = async () => {
      const exitReq = await fetch('/api/exit-preview')
      if (exitReq.status === 200) {
        router.reload()
      }
    }
    exit()
  }, [router])

  return (
    <ThemePreferenceProvider>
      <AdminBar id={pageID} collection={collection} preview={preview} onPreviewExit={onPreviewExit} />
      <GridProvider
        breakpoints={{
          s: 768,
          m: 1100,
          l: 1679,
        }}
        rowGap={{
          s: '1rem',
          m: '1rem',
          l: '2rem',
          xl: '4rem',
        }}
        colGap={{
          s: '10px',
          m: '10px',
          l: 'calc(var(--base) * 3)',
          xl: 'calc(var(--base) * 3)',
        }}
        cols={{
          s: 8,
          m: 8,
          l: 12,
          xl: 12,
        }}
      >
        <ModalProvider>
          <Header {...pageProps.mainMenu} />
          <Component {...pageProps} />

          <ModalContainer />
        </ModalProvider>
      </GridProvider>
    </ThemePreferenceProvider>
  )
}

export default PayloadApp
