'use client'

import { LineBlip } from '@components/LineBlip'
import Link from 'next/link'
import React, { useState } from 'react'
// eslint-disable-next-line import/no-cycle
import { LinkType, Reference } from '../CMSLink'
import { ArrowIcon } from '../../icons/ArrowIcon'
import { SearchIcon } from '../../icons/SearchIcon'
import classes from './index.module.scss'
import { Page } from '../../payload-types'

export type Props = {
  appearance?: 'default' | 'primary' | 'secondary'
  el?: 'button' | 'link' | 'a'
  onClick?: () => void
  href?: string
  newTab?: boolean
  className?: string
  label?: string
  labelStyle?: 'mono' | 'regular'
  icon?: 'arrow' | 'search'
  fullWidth?: boolean
  mobileFullWidth?: boolean
  type?: LinkType
  reference?: Reference
  htmlButtonType?: 'button' | 'submit'
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  disableLineBlip?: boolean
}

const icons = {
  arrow: ArrowIcon,
  search: SearchIcon,
}

type GenerateSlugType = {
  type?: LinkType
  url?: string
  reference?: Reference
}
const generateHref = (args: GenerateSlugType): string => {
  const { reference, url, type } = args

  if ((type === 'custom' || type === undefined) && url) {
    return url
  }

  if (type === 'reference' && reference?.value && typeof reference.value !== 'string') {
    if (reference.relationTo === 'pages') {
      const value = reference.value as Page
      const breadcrumbs = value?.breadcrumbs
      const hasBreadcrumbs = breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0
      if (hasBreadcrumbs) {
        return breadcrumbs[breadcrumbs.length - 1]?.url as string
      }
    }

    if (reference.relationTo === 'posts') {
      return `/blog/${reference.value.slug}`
    }

    if (reference.relationTo === 'case_studies') {
      return `/case-studies/${reference.value.slug}`
    }

    return `/${reference.relationTo}/${reference.value.slug}`
  }

  return ''
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
    type,
    reference,
    newTab,
    appearance = 'default',
    className: classNameFromProps,
    onClick,
    fullWidth,
    mobileFullWidth,
    htmlButtonType = 'button',
    href: hrefFromProps,
    disableLineBlip,
  } = props

  const href = hrefFromProps || generateHref({ type, reference })

  const [isHovered, setIsHovered] = useState(false)

  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  const className = [
    classNameFromProps,
    classes.button,
    classes[`appearance--${appearance}`],
    fullWidth && classes['full-width'],
    mobileFullWidth && classes['mobile-full-width'],
  ]
    .filter(Boolean)
    .join(' ')

  if (el === 'link') {
    return (
      <Link href={href} legacyBehavior passHref>
        <a
          className={className}
          {...newTabProps}
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        >
          {appearance === 'default' && !disableLineBlip && <LineBlip active={isHovered} />}
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
        {...newTabProps}
        href={href}
        onClick={onClick}
        onMouseEnter={() => {
          setIsHovered(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
        }}
      >
        {appearance === 'default' && !disableLineBlip && <LineBlip active={isHovered} />}
        <ButtonContent {...props} />
      </Element>
    )
  }

  return null
}
