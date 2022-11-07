'use client'

import Link from 'next/link'
import React, { useCallback } from 'react'
// eslint-disable-next-line import/no-cycle
import { Reference } from '../CMSLink'
import { ArrowIcon } from '../icons/ArrowIcon'
import { SearchIcon } from '../icons/SearchIcon'
import classes from './index.module.scss'

const animationDuration = 500

export type Props = {
  appearance?: 'default' | 'primary' | 'secondary'
  el?: 'button' | 'link' | 'a'
  onClick?: () => void
  href?: string
  newTab?: boolean
  className?: string
  label?: string
  labelStyle?: 'mono' | 'regular'
  icon?: string
  fullWidth?: boolean
  reference?: Reference
  htmlButtonType?: 'button' | 'submit'
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const icons = {
  arrow: ArrowIcon,
  search: SearchIcon,
}

const ButtonContent: React.FC<Props> = props => {
  const { icon, label, labelStyle = 'mono' } = props

  const Icon = icon ? icons[icon] : null

  return (
    <div className={classes.content}>
      {label && (
        <div
          className={[
            classes.label,
            !icon && classes['label-centered'],
            classes[`label-${labelStyle}`],
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </div>
      )}
      {Icon && label && (
        // NOTE: this is so that the icon and label can be reversed but keep spacing without messy css
        <span className={classes.spacer} />
      )}
      {Icon && <Icon className={classes.icon} />}
    </div>
  )
}

const elements: {
  [key: string]: React.ElementType
} = {
  a: 'a',
  button: 'button',
}

export const Button: React.FC<Props> = props => {
  const {
    el = 'button',
    newTab,
    href: hrefFromProps,
    appearance = 'default',
    className: classNameFromProps,
    fullWidth,
    reference,
    htmlButtonType = 'button',
    onMouseEnter,
    onMouseLeave,
  } = props

  let href = hrefFromProps
  if (reference && typeof reference?.value === 'object' && reference.value.slug) {
    href = `/${reference.value.slug}`
  }

  const [isHovered, setIsHovered] = React.useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false)

  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  const className = [
    classNameFromProps,
    classes.button,
    classes[`appearance--${appearance}`],
    isHovered && classes[`is--hovered`],
    isHovered && classes[`appearance--${appearance}--hovered`],
    isAnimatingOut && classes[`appearance--${appearance}-animating-out`],
    fullWidth && classes['full-width'],
  ]
    .filter(Boolean)
    .join(' ')

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (typeof onMouseEnter === 'function') {
      onMouseEnter()
    }
  }, [onMouseEnter])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setIsAnimatingOut(true)

    let timerID: NodeJS.Timeout // eslint-disable-line

    if (timerID) clearTimeout(timerID)

    timerID = setTimeout(() => {
      setIsAnimatingOut(false)
    }, animationDuration)

    if (typeof onMouseLeave === 'function') {
      onMouseLeave()
    }

    return () => {
      if (timerID) {
        clearTimeout(timerID)
      }
    }
  }, [onMouseLeave])

  if (el === 'link') {
    return (
      <Link href={href} legacyBehavior passHref>
        <a
          className={className}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...newTabProps}
        >
          <ButtonContent {...props} />
        </a>
      </Link>
    )
  }

  const Element = elements[el]

  if (Element) {
    return (
      <Element
        type={htmlButtonType}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...newTabProps}
        href={href}
      >
        <ButtonContent {...props} />
      </Element>
    )
  }

  return null
}
