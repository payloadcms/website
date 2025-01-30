import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Props = {
  as?: HeadingType
  children?: React.ReactNode
  className?: string
  element?: 'p' | HeadingType
  href?: string
  id?: string
  margin?: boolean
  marginBottom?: boolean
  marginTop?: boolean
}

const HeadingElement: React.FC<Partial<Props>> = (props) => {
  const { id, children, className = [], element: Element = 'h1', margin } = props

  return (
    <Element
      className={[className, margin === false ? classes.noMargin : ''].filter(Boolean).join(' ')}
    >
      <span className={classes.headingScrollTo} id={id} />
      {children}
    </Element>
  )
}

export const Heading: React.FC<Props> = (props) => {
  const { as: asFromProps, className, element: el = 'h1', margin, marginBottom, marginTop } = props
  const as = asFromProps ?? el

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
    <Link className={classList} href={props.href} prefetch={false}>
      <HeadingElement {...props} className={undefined} margin={false} />
    </Link>
  )
}
