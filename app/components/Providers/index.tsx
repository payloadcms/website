'use client'

import React from 'react'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { WindowInfoProvider } from '@faceless-ui/window-info'
import { AdminBar } from '../../../components/AdminBar'
import HeaderThemeProvider from '../../../components/providers/HeaderTheme'
import { ThemePreferenceProvider } from '../../../components/providers/Theme'

type Props = {
  id: string
  collection: string
  preview: boolean
  children: React.ReactNode
}

export const Providers: React.FC<Props> = ({ children, id, collection, preview }) => {
  return (
    <WindowInfoProvider
      breakpoints={{
        s: '(max-width: 768px)',
        m: '(max-width: 1100px)',
        l: '(max-width: 1600px)',
      }}
    >
      <ThemePreferenceProvider>
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
              <AdminBar id={id} collection={collection} preview={preview} />
              {children}
              <ModalContainer />
            </HeaderThemeProvider>
          </ModalProvider>
        </GridProvider>
      </ThemePreferenceProvider>
    </WindowInfoProvider>
  )
}
