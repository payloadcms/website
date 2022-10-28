import * as React from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalProvider, ModalContainer } from '@faceless-ui/modal'
import { WindowInfoProvider } from '@faceless-ui/window-info'
import { AdminBar } from '../components/AdminBar'
import { Header } from '../components/Header'
import { ThemePreferenceProvider } from '../components/providers/Theme'
import { Footer, MainMenu } from '../payload-types'
import HeaderThemeProvider from '../components/providers/HeaderTheme'

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
    <WindowInfoProvider
      breakpoints={{
        s: '(max-width: 768px)',
        m: '(max-width: 1100px)',
        l: '(max-width: 1600px)',
      }}
    >
      <ThemePreferenceProvider>
        <AdminBar
          id={pageID}
          collection={collection}
          preview={preview}
          onPreviewExit={onPreviewExit}
        />
        <GridProvider
          breakpoints={{
            s: 768,
            m: 1100,
            l: 1600,
          }}
          rowGap={{
            s: '1rem',
            m: '1rem',
            l: '2rem',
            xl: '4rem',
          }}
          colGap={{
            s: 'var(--base)',
            m: 'calc(var(--base) * 2)',
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
          <ModalProvider transTime={0} zIndex="var(--z-modal)">
            <HeaderThemeProvider>
              <Header {...pageProps.mainMenu} />
              <Component {...pageProps} />
              <ModalContainer />
            </HeaderThemeProvider>
          </ModalProvider>
        </GridProvider>
      </ThemePreferenceProvider>
    </WindowInfoProvider>
  )
}

export default PayloadApp
