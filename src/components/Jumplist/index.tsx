'use client'

import { ChainLinkIcon } from '@root/icons/ChainLinkIcon/index'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { createContext, use, useEffect, useReducer, useRef, useState } from 'react'

import type { IContext, NodeProps, Props, Reducer } from './types'

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

  return <Context value={{ dispatch, items, lastActive, setLastActive }}>{children}</Context>
}

export const useJumplist = (): IContext => use(Context)

export const Jumplist: React.FC<Props> = ({ className, injectProps, list }) => {
  const { items, lastActive } = useJumplist()
  const pathname = usePathname()

  return (
    <ul className={className}>
      {list.map(({ id, anchor, Component }) => (
        <li key={id}>
          <Link href={`${pathname}/#${anchor}`} replace>
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

export const JumplistNode: React.FC<NodeProps> = ({ id, type, children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch, setLastActive } = useJumplist()
  const pathname = usePathname()

  useEffect(() => {
    if (ref?.current) {
      const el = ref.current

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            dispatch({ id, active: entry.isIntersecting })

            if (entry.isIntersecting) {
              setLastActive(id)
            }
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
    <Link className={classes.node} href={`${pathname}/#${id}`} id={id} replace>
      <Element ref={ref}>
        <ChainLinkIcon className={classes.linkedHeading} size="large" />
        {children}
      </Element>
    </Link>
  )
}
