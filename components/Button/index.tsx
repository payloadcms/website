import Link from 'next/link'
import React from 'react'
import { ArrowIcon } from '../icons/ArrowIcon'
import classes from './index.module.scss'

export type Props = {
  appearance?: 'default' | 'primary' | 'secondary'
  el?: 'button' | 'link' | 'a'
  onClick?: () => void
  href?: string
  newTab?: boolean
  className?: string
  label?: string
  icon?: string
  fullWidth?: boolean
}

const elements: {
  [key: string]: React.ElementType
} = {
  a: 'a',
  button: 'button',
}

const icons = {
  'arrow': ArrowIcon,
}

export const Button: React.FC<Props> = ({
  el = 'button',
  label,
  newTab,
  href,
  appearance = 'default',
  className: classNameFromProps,
  icon,
  fullWidth,
}) => {
  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  const className = [
    classNameFromProps, 
    classes.button,
    classes[`appearance--${appearance}`],
    fullWidth && classes['full-width'],
  ].filter(Boolean).join(' ')

  const Icon = icon ? icons[icon] : null

  const content = (
    <div className={classes.content}>
      {label && (
        <span className={classes.label}>
          {label}
        </span>
      )}
      {Icon && label && (
        // NOTE: this is so that the icon and label can be reversed but keep spacing without messy css
        <span className={classes.spacer} />
      )}
      {Icon && (
        <Icon className={classes.icon} />
      )}
    </div>
  )

  if (el === 'link') {
    return (
      <Link
        href={href}
        legacyBehavior
        passHref
      >
        <a
          className={className}
          {...newTabProps}
        >
          {content}
        </a>
      </Link>
    )
  }

  const Element = elements[el]

  if (Element) {
    return (
      <Element
        className={className}
        {...newTabProps}
      >
        {content}
      </Element>
    )
  }

  return null
}
