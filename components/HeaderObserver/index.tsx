import * as React from 'react'
import { useWindowInfo } from '@faceless-ui/window-info'
import { useHeaderTheme } from '../providers/HeaderTheme'

import classes from './index.module.scss'

type Props = {
  color: 'light' | 'dark'
  className?: string
  zIndex?: number
  children?: React.ReactNode
  pullUp?: boolean
}
export const HeaderObserver: React.FC<Props> = ({
  color,
  children,
  className,
  zIndex,
  pullUp = false,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { height: windowHeight } = useWindowInfo()
  const { setHeaderColor, debug } = useHeaderTheme()
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (ref?.current && windowHeight && color) {
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
        10,
      )

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
          rootMargin: `0px 0px -${windowHeight - Math.ceil(headerHeight / 2)}px 0px`,
          threshold: 0,
        },
      )

      observer.observe(el)
      return () => {
        observer.unobserve(el)
      }
    }

    return () => null
  }, [setIsIntersecting, windowHeight, color])

  React.useEffect(() => {
    if (isIntersecting) {
      setHeaderColor(color)
    }
  }, [isIntersecting, color])

  return (
    <div
      className={[className, classes.headerObserver, debug && classes.debug]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex }}
    >
      {children && children}

      <div
        className={[classes.observerContainer, pullUp && classes.pullContainerUp]
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
