'use client'

import * as React from 'react'
import { useWindowInfo } from '@faceless-ui/window-info'
import { useHeaderTheme } from '@providers/HeaderTheme'

import { useTheme } from '@root/providers/Theme'

import classes from './index.module.scss'

type Props = {
  className?: string
  zIndex?: number
  children?: React.ReactNode
  pullUp?: boolean
}
const WrappedHeaderObserver: React.FC<
  Props & {
    isDetached: boolean
  }
> = ({ children, className, zIndex, pullUp = false, isDetached }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { height: windowHeight, width: windowWidth } = useWindowInfo()
  const { setHeaderColor, debug, isFirstObserver, setIsFirstObserver } = useHeaderTheme()
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const themeColor = useTheme()
  const isFirstRef = React.useRef(false)
  const [tick, setTick] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    let tickTimeout: NodeJS.Timeout | undefined
    const topBarHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height'),
      10,
    )
    const cssHeaderHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      10,
    )

    if (!cssHeaderHeight) {
      // workaround for styles not always being loaded in time (oddity with NextJS App folder)
      tickTimeout = setTimeout(() => {
        setTick(tick === undefined ? 1 : tick + 1)
      }, 50)

      // early return to prevent the observer from being set up incorrectly
      return
    }

    if (ref?.current && windowHeight && windowWidth && cssHeaderHeight && themeColor) {
      const halfHeaderHeight = windowHeight - topBarHeight - Math.ceil(cssHeaderHeight / 2)

      const el = ref.current
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            setIsIntersecting(entry.isIntersecting)
          })
        },
        {
          // intersection area is top of the screen from 0px to 50% of the header height
          // when the sticky element which is offset from the top by 50% of the header height
          // is intersecting the intersection area
          rootMargin: `0px 0px -${halfHeaderHeight}px 0px`,
          threshold: 0,
        },
      )

      observer.observe(el)
      return () => {
        observer.unobserve(el)
      }
    }

    return () => {
      if (tickTimeout) clearTimeout(tickTimeout)

      return null
    }
  }, [setIsIntersecting, windowHeight, themeColor, isDetached, windowWidth, tick])

  React.useEffect(() => {
    if (isIntersecting) {
      setHeaderColor(themeColor)
    }
  }, [isIntersecting, themeColor, setHeaderColor])

  React.useEffect(() => {
    if (isFirstObserver) {
      isFirstRef.current = true
      setIsFirstObserver(false)
    }
  }, [isDetached, isFirstObserver, setIsFirstObserver])

  if (isDetached) {
    return <React.Fragment>{children && children}</React.Fragment>
  }

  return (
    <div
      className={[className, classes.headerObserver, debug && classes.debug]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex }}
    >
      {children && children}

      <div
        className={[
          classes.observerContainer,
          (pullUp ?? isFirstRef.current) && classes.pullContainerUp,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/*
          the sticky div is 0px tall, and leaves
          the headers height of space between it
          and its header observer siblings
        */}
        <div ref={ref} className={classes.stickyObserver} />
      </div>
    </div>
  )
}

type Type = {
  isDetached: boolean
  detachParentObserver: () => void
  attachParentObserver: () => void
}
const Context = React.createContext<Type | undefined>(undefined)

const useParentHeaderObserver = (): Type | undefined => React.useContext(Context)
export const HeaderObserver: React.FC<Props> = props => {
  const [isDetached, setIsDetached] = React.useState(false)
  const parentObserver = useParentHeaderObserver()

  const detachParentObserver = React.useCallback(() => {
    setIsDetached(true)
  }, [])

  const attachParentObserver = React.useCallback(() => {
    setIsDetached(false)
  }, [])

  React.useEffect(() => {
    if (parentObserver !== undefined) {
      parentObserver.detachParentObserver()
    }

    return () => {
      // when a headerObserver unmounts and there is a parent observer
      // reattach the parent observer
      if (parentObserver !== undefined) {
        parentObserver.attachParentObserver()
      }
    }
  }, [parentObserver])

  return (
    <Context.Provider
      value={{
        isDetached,
        detachParentObserver,
        attachParentObserver,
      }}
    >
      <WrappedHeaderObserver {...props} isDetached={isDetached} />
    </Context.Provider>
  )
}
