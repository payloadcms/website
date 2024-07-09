'use client'

import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import Link from 'next/link'

import { usePathname } from 'next/navigation'

import { ChainLinkIcon } from '@root/icons/ChainLinkIcon/index.js'
import { IContext, NodeProps, Props, Reducer } from './types.js'

import classes from './index.module.scss'

const Context = createContext<IContext>({
  dispatch: () => null,
  items: {},
  lastActive: undefined,
  setLastActive: () => null,
})

const reducer: Reducer = (state, { id, active }) => ({
  ...state,
  [id]: active,
})

export const JumplistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, {})
  const [lastActive, setLastActive] = useState<string | undefined>()

  return (
    <Context.Provider value={{ items, dispatch, lastActive, setLastActive }}>
      {children}
    </Context.Provider>
  )
}

export const useJumplist = (): IContext => useContext(Context)

export const Jumplist: React.FC<Props> = ({ list, className, injectProps }) => {
  const { items, lastActive } = useJumplist()
  const pathname = usePathname()

  return (
    <ul className={className}>
      {list.map(({ id, Component }) => (
        <li key={id}>
          <Link href={`${pathname}/#${id}`} replace>
            <Component active={items[id] || lastActive === id} {...(injectProps || {})} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

const elements = {
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
}

export const JumplistNode: React.FC<NodeProps> = ({ children, id, type }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch, setLastActive } = useJumplist()
  const pathname = usePathname()

  useEffect(() => {
    if (ref?.current) {
      const el = ref.current

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            dispatch({ id, active: entry.isIntersecting })

            if (entry.isIntersecting) setLastActive(id)
          })
        },
        {
          rootMargin: '0px',
          threshold: 0.5,
        },
      )

      observer.observe(el)
      return () => observer.unobserve(el)
    }

    return () => null
  }, [dispatch, id, setLastActive])

  const Element: any = elements[type]

  return (
    <Link href={`${pathname}/#${id}`} replace className={classes.node} id={id}>
      <Element ref={ref}>
        <ChainLinkIcon size="large" className={classes.linkedHeading} />
        {children}
      </Element>
    </Link>
  )
}
