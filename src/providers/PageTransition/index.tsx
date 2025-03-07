'use client'

import canUseDom from '@root/utilities/can-use-dom'
import { usePathname } from 'next/navigation'
import React, { useEffect, useReducer, useRef, useState } from 'react'

export const PageTransition: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const { children } = props
  const nodeRef = useRef(null)
  const pathname = usePathname()
  const hasInitialized = useRef(false)

  // this is used to force a re-render when the hash changes to avoid race conditions
  // by ensuring the DOM is updated before we running `getElementById` and `scrollIntoView`
  const [transitionTicker, dispatchTransitionTicker] = useReducer((state: number) => state + 1, 0)

  const [hash, setHash] = useState<string>(() => {
    if (!canUseDom) {
      return ''
    }
    return window.location.hash
  })

  useEffect(() => {
    const fn = () => {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', fn)

    return () => window.removeEventListener('hashchange', fn)
  }, [])

  useEffect(() => {
    if (hash) {
      const hashWithoutMark = hash.substring(1)
      const element = document.getElementById(hashWithoutMark)
      element?.scrollIntoView()
    }
  }, [hash, transitionTicker])

  useEffect(() => {
    if (hasInitialized.current) {
      window.scrollTo(0, 0)
    }
    hasInitialized.current = true
  }, [pathname, hasInitialized])

  useEffect(() => {
    if (hash) {
      dispatchTransitionTicker()
    }
  }, [hash])

  return <div ref={nodeRef}>{children}</div>
}
