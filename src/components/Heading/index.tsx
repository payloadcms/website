import React from 'react'
import Link from 'next/link'

import classes from './index.module.scss'

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Props = {
  element?: HeadingType | 'p'
  as?: HeadingType
  margin?: boolean
  marginTop?: boolean
  marginBottom?: boolean
  children?: React.ReactNode
  id?: string
  href?: string
  className?: string
}

const HeadingElement: React.FC<Partial<Props>> = props => {
  const { element: Element = 'h1', children, id, className = [], margin } = props

  return (
    <Element
      className={[className, margin === false ? classes.noMargin : ''].filter(Boolean).join(' ')}
    >
      <span id={id} className={classes.headingScrollTo} />
      {children}
    </Element>
  )
}

export const Heading: React.FC<Props> = props => {
  const { element: el = 'h1', as = el, margin, marginTop, marginBottom, className } = props

  const classList = [
    className,
    as && classes[as],
    margin === false && classes.noMargin,
    marginTop === false && classes.noMarginTop,
    marginBottom === false && classes.noMarginBottom,
  ]
    .filter(Boolean)
    .join(' ')

  if (!props.href) {
    return <HeadingElement {...props} className={classList} />
  }

  return (
    <Link href={props.href} className={classList} prefetch={false}>
      <HeadingElement {...props} className={undefined} margin={false} />
    </Link>
  )
}
