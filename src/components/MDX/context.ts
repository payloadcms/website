'use client'
import { createContext, useContext } from 'react'

import type { Heading, IContext } from './types.js'

const Context = createContext<IContext>({
  toc: [] as Array<[string, Heading]>,
  addHeading: () => null,
})

export default Context

export const useMDX = (): IContext => useContext(Context)
