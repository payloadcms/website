'use client'

import React from 'react'
import { ScrollInfoProvider } from '@faceless-ui/scroll-info'
import { MouseInfoProvider } from '@faceless-ui/mouse-info'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { WindowInfoProvider } from '@faceless-ui/window-info'
import HeaderThemeProvider from './HeaderTheme'
import { ThemePreferenceProvider } from './Theme'
import { ComputedCSSValuesProvider } from './ComputedCSSValues'

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ScrollInfoProvider>
      <MouseInfoProvider>
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
                m: 1024,
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
                l: 'calc(var(--base) * 2)',
                xl: 'calc(var(--base) * 3)',
              }}
              cols={{
                s: 8,
                m: 8,
                l: 12,
                xl: 12,
              }}
            >
              <ComputedCSSValuesProvider>
                <ModalProvider transTime={0} zIndex="var(--z-modal)">
                  <HeaderThemeProvider debug>
                    {children}
                    <ModalContainer />
                  </HeaderThemeProvider>
                </ModalProvider>
              </ComputedCSSValuesProvider>
            </GridProvider>
          </ThemePreferenceProvider>
        </WindowInfoProvider>
      </MouseInfoProvider>
    </ScrollInfoProvider>
  )
}
