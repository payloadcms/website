import * as React from 'react'
import { useWindowInfo } from '@faceless-ui/window-info'
import { useHeaderTheme } from '../providers/HeaderTheme'

import classes from './index.module.scss'

type Props = {
  color: 'light' | 'dark'
  className?: string
  zIndex?: number
  children: React.ReactNode
}
export const HeaderObserver: React.FC<Props> = ({ color, children, className, zIndex }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { height } = useWindowInfo()
  const { setHeaderColor, debug } = useHeaderTheme()
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    if (ref?.current && height && color) {
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
          rootMargin: `0px 0px ${headerHeight - height}px 0px`,
          threshold: 0,
        },
      )

      observer.observe(el)
      return () => {
        observer.unobserve(el)
      }
    }

    return () => null
  }, [setIsIntersecting, height, color])

  React.useEffect(() => {
    if (isIntersecting) {
      setHeaderColor(color)
    }
  }, [isIntersecting])

  return (
    <div
      className={[className, classes.headerObserver, debug && classes.debug]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex }}
    >
      {children}

      <div className={classes.observerContainer}>
        <div ref={ref} className={classes.stickyObserver} />
      </div>
    </div>
  )
}
