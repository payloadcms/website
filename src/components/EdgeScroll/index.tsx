import React from 'react'

import classes from './index.module.scss'

export const EdgeScroll: React.FC<{
  children: React.ReactNode
  className?: string
  element?: keyof JSX.IntrinsicElements
  mobileOnly?: boolean
}> = ({ children, element = 'div', className, mobileOnly }) => {
  const Element = element

  return (
    <Element
      className={[classes.edgeScroll, mobileOnly && classes.mobileOnly, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={[classes.gradient, classes.left].filter(Boolean).join(' ')} />
      {children}
      <div className={[classes.gradient, classes.right].filter(Boolean).join(' ')} />
    </Element>
  )
}
