'use client'

import React from 'react'
import { CookiesProvider } from 'react-cookie'
import { IconProps, Slide, ToastContainer } from 'react-toastify'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { MouseInfoProvider } from '@faceless-ui/mouse-info'
import { ScrollInfoProvider } from '@faceless-ui/scroll-info'
import { WindowInfoProvider } from '@faceless-ui/window-info'

// import { ClockIcon } from '@root/graphics/ClockIcon'
// import { InfoIcon } from '@root/graphics/InfoIcon'
// import { CheckIcon } from '@root/icons/CheckIcon/index.js'
// import { CloseIcon } from '@root/icons/CloseIcon/index.js'
// import { ErrorIcon } from '@root/icons/ErrorIcon'
import { HeaderIntersectionObserver } from '@root/providers/HeaderIntersectionObserver/index.js'
import { AuthProvider } from './Auth/index.js'
import { ComputedCSSValuesProvider } from './ComputedCSSValues/index.js'
import { PageTransition } from './PageTransition/index.js'
import { ThemePreferenceProvider } from './Theme/index.js'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <CookiesProvider>
      <AuthProvider>
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
                    s: '1rem',
                    m: '2rem',
                    l: '2rem',
                    xl: '3rem',
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
                      <PageTransition>
                        <HeaderIntersectionObserver>
                          {children}
                          <ModalContainer />
                          <ToastContainer
                            position="bottom-center"
                            transition={Slide}
                            icon={false}
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
