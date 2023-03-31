import React, { useCallback, useState } from 'react'

import Context from './context'
import { AddHeading, Heading, IContext } from './types'

export const MDXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toc, setTOC] = useState<Map<string, Heading>>(new Map())

  const addHeading: AddHeading = useCallback(
    (anchor, heading, type) => {
      if (!toc.has(anchor)) {
        const newTOC = new Map(toc)
        newTOC.set(anchor, { heading, type, anchor })
        setTOC(newTOC)
      }
    },
    [toc],
  )

  const context: IContext = {
    toc: Array.from(toc).reverse(),
    addHeading,
  }

  return (
    <div>
      <Context.Provider value={context}>{children}</Context.Provider>
    </div>
  )
}
