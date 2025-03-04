import type React from 'react'

import { useEffect, useState } from 'react'

interface Size {
  height: number
  width: number
}

interface Resize {
  size?: Size
}

export const useResize = <T>(ref: React.MutableRefObject<null | T>): Resize => {
  const [size, setSize] = useState<Size>()

  useEffect(() => {
    let observer: any // eslint-disable-line

    const { current: currentRef } = ref

    if (currentRef) {
      observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const {
            contentBoxSize,
            contentRect, // for Safari iOS compatibility, will be deprecated eventually (see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentRect)
          } = entry

          let newWidth = 0
          let newHeight = 0

          if (contentBoxSize) {
            const newSize = Array.isArray(contentBoxSize) ? contentBoxSize[0] : contentBoxSize

            if (newSize) {
              const { blockSize, inlineSize } = newSize
              newWidth = inlineSize
              newHeight = blockSize
            }
          } else if (contentRect) {
            // see note above for why this block is needed
            const { height, width } = contentRect
            newWidth = width
            newHeight = height
          }

          setSize({
            height: newHeight,
            width: newWidth,
          })
        })
      })

      observer.observe(currentRef)
    }

    return () => {
      if (observer) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref])

  return {
    size,
  }
}
