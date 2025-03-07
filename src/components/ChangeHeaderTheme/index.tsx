import type { Theme } from '@root/providers/Theme/types'

import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import * as React from 'react'

import classes from './index.module.scss'

type ThemeHeaderProps = {
  children?: React.ReactNode
  theme: Theme
}
export const ChangeHeaderTheme: React.FC<ThemeHeaderProps> = ({ children, theme }) => {
  const observableRef = React.useRef<HTMLDivElement>(null)
  const { addObservable, debug } = useHeaderObserver()

  React.useEffect(() => {
    const observableElement = observableRef?.current
    if (observableElement) {
      addObservable(observableElement, true)
    }
  }, [addObservable])

  return (
    <div className={[classes.headerObserver, debug && classes.debug].filter(Boolean).join(' ')}>
      {children && children}

      <div className={[classes.observerContainer].filter(Boolean).join(' ')}>
        <div className={classes.stickyObserver} data-theme={theme} ref={observableRef} />
      </div>
    </div>
  )
}
