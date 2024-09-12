'use client'

import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { MouseInfoProvider } from '@faceless-ui/mouse-info'
import { ScrollInfoProvider } from '@faceless-ui/scroll-info'
import { WindowInfoProvider } from '@faceless-ui/window-info'
import React from 'react'
import { CookiesProvider } from 'react-cookie'

// import { ClockIcon } from '@root/graphics/ClockIcon'
// import { InfoIcon } from '@root/graphics/InfoIcon'
// import { CheckIcon } from '@root/icons/CheckIcon/index.js'
// import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { Slide } from '@faceless-ui/slider'
// import { ErrorIcon } from '@root/icons/ErrorIcon'
import { HeaderIntersectionObserver } from '@root/providers/HeaderIntersectionObserver/index.js'
import { Toaster } from 'sonner'

import { AuthProvider } from './Auth/index.js'
import { ComputedCSSValuesProvider } from './ComputedCSSValues/index.js'
import { PageTransition } from './PageTransition/index.js'
import { ThemePreferenceProvider } from './Theme/index.js'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    // @ts-expect-error
    <CookiesProvider>
      <AuthProvider>
        <ScrollInfoProvider>
          <MouseInfoProvider>
            <WindowInfoProvider
              breakpoints={{
                l: '(max-width: 1600px)',
                m: '(max-width: 1100px)',
                s: '(max-width: 768px)',
              }}
            >
              <ThemePreferenceProvider>
                <GridProvider
                  breakpoints={{
                    l: 1680,
                    m: 1024,
                    s: 768,
                  }}
                  colGap={{
                    l: '2rem',
                    m: '2rem',
                    s: '1rem',
                    xl: '3rem',
                  }}
                  cols={{
                    l: 12,
                    m: 8,
                    s: 8,
                    xl: 12,
                  }}
                  rowGap={{
                    l: '2rem',
                    m: '1rem',
                    s: '1rem',
                    xl: '4rem',
                  }}
                >
                  <ComputedCSSValuesProvider>
                    <ModalProvider transTime={0} zIndex="var(--z-modal)">
                      <PageTransition>
                        <HeaderIntersectionObserver>
                          {children}
                          <ModalContainer />
                          {/* @ts-expect-error */}
                          <Toaster
                            position="bottom-right"
                            // TODO: Redesign icons
                            // icon={({ type }: IconProps) => {
                            //   switch (type) {
                            //     case 'info':
                            //       return <InfoIcon />
                            //     case 'success':
                            //       return <CheckIcon />
                            //     case 'warning':
                            //       return <ErrorIcon />
                            //     case 'error':
                            //       return <CloseIcon />
                            //     default:
                            //       return null
                            //   }
                            // }}
                          />
                        </HeaderIntersectionObserver>
                      </PageTransition>
                    </ModalProvider>
                  </ComputedCSSValuesProvider>
                </GridProvider>
              </ThemePreferenceProvider>
            </WindowInfoProvider>
          </MouseInfoProvider>
        </ScrollInfoProvider>
      </AuthProvider>
    </CookiesProvider>
  )
}
