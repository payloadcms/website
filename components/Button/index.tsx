import Link from 'next/link'
import React from 'react'
import classes from './index.module.scss'

export type Props = {
  appearance?: 'default' | 'primary' | 'secondary'
  el?: 'button' | 'link' | 'a'
  onClick?: () => void
  href?: string
  newTab?: boolean
  className?: string
  label?: string
  children?: React.ReactNode
}

const elements = {
  a: 'a',
  link: Link,
  button: 'button',
}

export const Button: React.FC<Props> = ({
  el = 'button',
  children,
  label,
  newTab,
  href,
  appearance = 'default',
  className: classNameFromProps,
}) => {
  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  const Element = elements[el]
  const className = [classNameFromProps, classes[`appearance--${appearance}`], classes.button]
    .filter(Boolean)
    .join(' ')

  const elementProps = {
    ...newTabProps,
    href,
    className,
  }

  const content = (
    <div className={classes.content}>
      <span className={classes.label}>
        {label && label}
        {children && children}
      </span>
    </div>
  )

  const linkProps = {
    ...elementProps,
    ...newTabProps,
    href,
  }

  return (
    <Element {...(el === 'link' ? linkProps : elementProps)}>
      <React.Fragment>
        {el === 'link' && (
          <a {...newTabProps} href={href} className={elementProps.className}>
            {content}
          </a>
        )}
        {el !== 'link' && <React.Fragment>{content}</React.Fragment>}
      </React.Fragment>
    </Element>
  )
}
