'use client'
import { createContext, useContext } from 'react'

import type { Heading, IContext } from './types.js'

const Context = createContext<IContext>({
  addHeading: () => null,
  toc: [] as Array<[string, Heading]>,
})

export default Context

export const useMDX = (): IContext => useContext(Context)
