'use client'

import React from 'react'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { WindowInfoProvider } from '@faceless-ui/window-info'
import HeaderThemeProvider from './HeaderTheme'
import { ThemePreferenceProvider } from './Theme'
import { Theme } from './Theme/types'

export const Providers: React.FC<{ children: React.ReactNode; theme: Theme }> = ({
  children,
  theme,
}) => {
  return (
    <WindowInfoProvider
      breakpoints={{
        s: '(max-width: 768px)',
        m: '(max-width: 1100px)',
        l: '(max-width: 1680px)',
      }}
    >
      <ThemePreferenceProvider theme={theme}>
        <GridProvider
          breakpoints={{
            s: 768,
            m: 1100,
            l: 1680,
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
              {children}
              <ModalContainer />
            </HeaderThemeProvider>
          </ModalProvider>
        </GridProvider>
      </ThemePreferenceProvider>
    </WindowInfoProvider>
  )
}
