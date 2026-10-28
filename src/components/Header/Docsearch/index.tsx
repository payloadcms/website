import Dynamic from 'next/dynamic'
import React from 'react'

import classes from './index.module.scss'

const Component = Dynamic(() => import('./Component'))

const mobileHeaderMediaQuery = '(max-width: 1170px)'

export const DocSearch: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
  const [shouldRender, setShouldRender] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(mobileHeaderMediaQuery)
    const updateShouldRender = () => {
      setShouldRender(variant === 'mobile' ? mediaQuery.matches : !mediaQuery.matches)
    }

    updateShouldRender()
    mediaQuery.addEventListener('change', updateShouldRender)

    return () => mediaQuery.removeEventListener('change', updateShouldRender)
  }, [variant])

  if (!shouldRender) {
    return null
  }

  return (
    <div className={classes.docSearch}>
      <React.Suspense>
        <Component />
      </React.Suspense>
    </div>
  )
}
