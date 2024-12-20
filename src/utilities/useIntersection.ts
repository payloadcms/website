import type React from 'react'

import { useEffect, useState } from 'react'

interface Intersection {
  hasIntersected?: boolean
  isIntersecting: boolean
}

const useIntersection = ({
  log,
  ref,
  root,
  rootMargin,
  threshold,
}: {
  log?: boolean
  ref: React.MutableRefObject<null>
  root?: React.MutableRefObject<null>
  rootMargin?: string
  threshold?: number
}): Intersection => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)
  const [hasIntersected, setHasIntersected] = useState<boolean>()

  useEffect(() => {
    let observer: any // eslint-disable-line

    const { current: currentRef } = ref

    if (currentRef) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsIntersecting(entry.isIntersecting)
          })
        },
        {
          root: root?.current || null,
          rootMargin: rootMargin || '0px',
          threshold: threshold || 0.05,
        },
      )

      observer.observe(currentRef)
    }

    return () => {
      if (observer) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref, rootMargin, threshold, root, log])

  useEffect(() => {
    if (isIntersecting) {
      setHasIntersected(true)
    }
  }, [isIntersecting])

  return {
    hasIntersected,
    isIntersecting,
  }
}

export default useIntersection
