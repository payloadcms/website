import { AppProps } from 'next/app'
import { Header } from '../components/layout/Header'
import { ThemeProvider } from '../components/providers/Theme'
import { GridProvider } from '@faceless-ui/css-grid'
import { Footer, MainMenu } from '../payload-types'

import '../css/app.scss'

type AppPropsWithGlobals = AppProps<{
  mainMenu: MainMenu
  footer: Footer
  page: any
}>

const PayloadApp = (appProps: AppPropsWithGlobals): React.ReactElement => {
  const { Component, pageProps } = appProps

  return (
    <ThemeProvider>
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
          l: '4rem',
          xl: '4rem',
        }}
        cols={{
          s: 8,
          m: 8,
          l: 12,
          xl: 12,
        }}
      >
        <Header {...pageProps.mainMenu} />
        <Component {...pageProps} />
      </GridProvider>
    </ThemeProvider>
  )
}

export default PayloadApp
