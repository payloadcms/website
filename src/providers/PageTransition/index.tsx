import React, { useCallback, useEffect, useRef } from 'react'

export const pageTransTime = 400

export const PageTransition: React.FC<{
  children: React.ReactNode
}> = props => {
  const { children } = props
  const hasInitialized = useRef(false) // don't scroll to top on first render
  const nodeRef = useRef(null)

  const handleTransition = useCallback(() => {
    document.documentElement.style.scrollBehavior = 'auto' // instantly scroll

    const scrollToTopTimer = setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.style.removeProperty('scroll-behavior')
    }, pageTransTime)

    const { hash } = window?.location
    let scrollToHashTimer: NodeJS.Timeout

    if (hash) {
      scrollToHashTimer = setTimeout(() => {
        const hashWithoutMark = hash.substring(1)
        const element = document.getElementById(hashWithoutMark)
        element?.scrollIntoView()
      }, pageTransTime)

      return () => {
        if (scrollToTopTimer) clearTimeout(scrollToTopTimer)
        if (scrollToHashTimer) clearTimeout(scrollToHashTimer)
      }
    }
    return null
  }, [])

  useEffect(() => {
    if (hasInitialized.current) {
      handleTransition() // on every route change
    } else hasInitialized.current = true
  }, [handleTransition])

  return <div ref={nodeRef}>{children}</div>
}
