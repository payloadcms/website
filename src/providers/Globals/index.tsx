'use client'

import React from 'react'

import { Template } from '@root/payload-types copy'

const GlobalsContext = React.createContext<{
  templates: Template[]
}>({
  templates: [],
})

export const useGlobals = () => React.useContext(GlobalsContext)

export const GlobalsProvider: React.FC<{
  children: React.ReactNode
  templates: Template[]
}> = props => {
  const { children, templates } = props

  return (
    <GlobalsContext.Provider
      value={{
        templates,
      }}
    >
      {children}
    </GlobalsContext.Provider>
  )
}
