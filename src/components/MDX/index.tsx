'use client'
import React, { useCallback, useState } from 'react'

import type { AddHeading, Heading, IContext } from './types.js'

import Context from './context.js'

export const MDXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toc, setTOC] = useState<Map<string, Heading>>(new Map())

  const addHeading: AddHeading = useCallback(
    (anchor, heading, type) => {
      if (!toc.has(anchor)) {
        const newTOC = new Map(toc)
        newTOC.set(anchor, { type, anchor, heading })
        setTOC(newTOC)
      }
    },
    [toc],
  )

  const context: IContext = {
    addHeading,
    toc: Array.from(toc).reverse(),
  }

  return (
    <div>
      <Context.Provider value={context}>{children}</Context.Provider>
    </div>
  )
}
