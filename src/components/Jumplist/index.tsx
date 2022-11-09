import React, { useEffect, useState, useContext, createContext, useReducer, useRef } from 'react'
import { Props, NodeProps, Reducer, IContext } from './types'
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

  return (
    <ul className={className}>
      {list.map(({ id, Component }) => (
        <li key={id}>
          <a href={`#${id}`}>
            <Component active={items[id] || lastActive === id} {...(injectProps || {})} />
          </a>
        </li>
      ))}
    </ul>
  )
}

export const JumplistNode: React.FC<NodeProps> = ({ children, id }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { dispatch, setLastActive } = useJumplist()

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

  return (
    <div ref={ref} id={id} className={classes.node}>
      {children}
    </div>
  )
}
