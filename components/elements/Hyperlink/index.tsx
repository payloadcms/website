import React, { CSSProperties } from 'react'
import Link from 'next/link'
import { CaseStudy, Page, Post, UseCase } from '../../../payload-types'

import classes from './index.module.scss'

export type Link = {
  type?: 'reference' | 'custom'
  newTab?: boolean
  reference:
    | {
        value: string | Page
        relationTo: 'pages'
      }
    | {
        value: string | Post
        relationTo: 'posts'
      }
    | {
        value: string | UseCase
        relationTo: 'use-cases'
      }
    | {
        value: string | CaseStudy
        relationTo: 'case-studies'
      }
  url: string
  label: string
}

// NOTE: this component exists so that any element can be linked with a sanitized url, and conditionally passed through local routing
// this adds consistency and safety to any links rendered through the app, in or outside a traditional button component

export type HyperlinkProps = {
  href?: string
  className?: string
  linkFromCMS?: Link
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
  underline?: boolean
  underlineOnHover?: boolean
  dimOnHover?: boolean
  htmlAttributes?: {
    [key: string]: unknown
  }
  display?: 'block'
  style?: CSSProperties
  newTab?: boolean
  children?: React.ReactNode
}

export const Hyperlink: React.FC<HyperlinkProps> = props => {
  const {
    className,
    href: hrefFromProps = '',
    children,
    linkFromCMS, // send raw cms link data though this prop to have its href extracted
    onMouseEnter,
    onMouseLeave,
    onClick,
    underline,
    underlineOnHover,
    dimOnHover = true,
    htmlAttributes,
    display,
    style,
  } = props

  let href = hrefFromProps

  // links from the cms need to be extracted
  if (linkFromCMS) {
    const { type, url } = linkFromCMS

    if (type === 'custom' && url) {
      href = url
    }
  }

  const sharedProps = {
    ...htmlAttributes,
    target: props.newTab || linkFromCMS.newTab ? '_blank' : undefined,
    className: [
      className,
      classes.hyperlink,
      underline && classes.underline,
      underline !== true && underlineOnHover && classes.underlineOnHover,
      dimOnHover && href && classes.dimOnHover, // only do when href is actually set
      display && classes[`display-${display}`],
    ]
      .filter(Boolean)
      .join(' '),
    onMouseEnter,
    onMouseLeave,
    onClick,
    style,
  }

  const hrefIsLocal = ['tel:', 'mailto:', '/'].some(prefix => href.startsWith(prefix))

  if (!hrefIsLocal && href) {
    try {
      const url = new URL(href)
      if (url.origin === process.env.NEXT_PUBLIC_APP_URL) {
        href = url.href.replace(process.env.NEXT_PUBLIC_APP_URL, '')
      }
    } catch (e) {
      console.error(`Failed to format url: ${href}`, e)
    }
  }

  if (!href) return null

  if (href.indexOf('/') === 0) {
    return (
      <Link href={href} prefetch={false} scroll={false}>
        <a {...sharedProps}>{children}</a>
      </Link>
    )
  }

  return (
    <a href={href} {...sharedProps}>
      {children}
    </a>
  )
}
