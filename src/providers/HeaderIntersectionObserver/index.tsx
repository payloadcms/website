'use client'

import * as React from 'react'
import { useWindowInfo } from '@faceless-ui/window-info'

import { useThemePreference } from '@root/providers/Theme'
import { Theme } from '@root/providers/Theme/types'

import classes from './index.module.scss'

type ContextT = {
  addObservable: (el: HTMLElement, isAttached: boolean) => void
  headerTheme?: Theme | null
  setHeaderTheme: (theme?: Theme | null) => void
  debug?: boolean
}
const Context = React.createContext<ContextT>({
  addObservable: () => {},
  headerTheme: null,
  setHeaderTheme: () => {},
  debug: false,
})
export const useHeaderObserver = (): ContextT => React.useContext(Context)

type HeaderIntersectionObserverProps = {
  children: React.ReactNode
  debug?: boolean
}
export const HeaderIntersectionObserver: React.FC<HeaderIntersectionObserverProps> = ({
  children,
  debug = false,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowInfo()
  const { theme } = useThemePreference()
  const [headerTheme, setHeaderTheme] = React.useState<Theme | null | undefined>(null)
  const [observer, setObserver] = React.useState<IntersectionObserver | undefined>(undefined)
  const [tick, setTick] = React.useState<number | undefined>(undefined)

  const addObservable = React.useCallback(
    (el: HTMLElement) => {
      if (observer) {
        observer.observe(el)
      }
    },
    [observer],
  )

  React.useEffect(() => {
    let observerRef: IntersectionObserver | undefined

    const cssHeaderHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      10,
    )

    let tickTimeout: NodeJS.Timeout | undefined
    if (!cssHeaderHeight) {
      // workaround for styles not always being loaded in time (oddity with NextJS App folder)
      tickTimeout = setTimeout(() => {
        setTick(tick === undefined ? 1 : tick + 1)
      }, 50)

      // early return to prevent the observer from being set up incorrectly
      return
    }

    if (windowHeight) {
      const halfHeaderHeight = windowHeight - Math.ceil(cssHeaderHeight / 2)

      observerRef = new IntersectionObserver(
        entries => {
          const intersectingElement = entries.find(entry => entry.isIntersecting)

          if (intersectingElement) {
            setHeaderTheme(intersectingElement.target.getAttribute('data-theme') as Theme)
          } else {
            setHeaderTheme(theme)
          }
        },
        {
          // intersection area is top of the screen from 0px to 50% of the header height
          // when the sticky element which is offset from the top by 50% of the header height
          // is intersecting the intersection area
          rootMargin: `0px 0px -${halfHeaderHeight}px 0px`,
          threshold: 0,
        },
      )

      setObserver(observerRef)
    }

    return () => {
      if (tickTimeout) clearTimeout(tickTimeout)
      if (observerRef) {
        observerRef.disconnect()
      } else {
        setHeaderTheme(theme)
      }
    }
  }, [windowWidth, windowHeight, theme, tick])

  return (
    <Context.Provider
      value={{
        addObservable,
        headerTheme,
        debug,
        setHeaderTheme,
      }}
    >
      <>
        {debug && <div className={classes.intersectionObserverDebugger} />}
        {children}
      </>
    </Context.Provider>
  )
}
