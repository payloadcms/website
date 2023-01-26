import Link from 'next/link'
import React from 'react'
import classes from './index.module.scss'

export const Heading: React.FC<{
  element?: React.ElementType
  as?: string
  margin?: boolean
  marginTop?: boolean
  marginBottom?: boolean
  children?: React.ReactNode
  id?: string
  href?: string
  className?: string
}> = props => {
  const {
    element: Element = 'h1',
    as,
    children,
    margin,
    marginTop,
    marginBottom,
    id,
    href,
    className,
  } = props

  return (
    <Element
      className={[
        className,
        classes.heading,
        as && classes[as],
        margin === false && classes.noMargin,
        marginTop === false && classes.noMarginTop,
        marginBottom === false && classes.noMarginBottom,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span id={id} className={classes.headingScrollTo} />
      {href && (
        <Link className={classes.headingAnchor} href={href}>
          {children}
        </Link>
      )}
      {!href && <div className={classes.headingAnchor}>{children}</div>}
    </Element>
  )
}
