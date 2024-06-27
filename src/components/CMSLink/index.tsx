import React from 'react'
import Link from 'next/link'

import { CaseStudy, Page, Post } from '@root/payload-types.js'
// eslint-disable-next-line import/no-cycle
import { Button, ButtonProps } from '../Button/index.js'

const relationSlugs = {
  case_studies: 'case-studies',
}

type PageReference = {
  value: string | Page
  relationTo: 'pages'
}

type PostsReference = {
  value: string | Post
  relationTo: 'posts'
}

type CaseStudyReference = {
  value: string | CaseStudy
  relationTo: (typeof relationSlugs)['case_studies']
}

export type LinkType = 'reference' | 'custom' | null
export type Reference = PageReference | PostsReference | CaseStudyReference | null

export type CMSLinkType = {
  type?: LinkType | null
  newTab?: boolean | null
  reference?: Reference | null
  url?: string | null
  label?: string | null
  appearance?: 'default' | 'primary' | 'secondary' | 'text' | null
  children?: React.ReactNode
  fullWidth?: boolean
  mobileFullWidth?: boolean
  className?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  buttonProps?: ButtonProps
}

type GenerateSlugType = {
  type?: LinkType | null
  url?: string | null
  reference?: Reference | null
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

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  url,
  newTab,
  reference,
  label,
  appearance,
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  fullWidth = false,
  mobileFullWidth = false,
  buttonProps: buttonPropsFromProps,
}) => {
  let href = generateHref({ type, url, reference })

  if (!href) {
    return (
      <span
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label}
        {children}
      </span>
    )
  }

  if (!appearance) {
    const hrefIsLocal = ['tel:', 'mailto:', '/'].some(prefix => href.startsWith(prefix))

    if (!hrefIsLocal && href !== '#') {
      try {
        const objectURL = new URL(href)
        if (objectURL.origin === process.env.NEXT_PUBLIC_SITE_URL) {
          href = objectURL.href.replace(process.env.NEXT_PUBLIC_SITE_URL, '')
        }
      } catch (e) {
        // Do not throw error if URL is invalid
        // This will prevent the page from building
        console.log(`Failed to format url: ${href}`, e) // eslint-disable-line no-console
      }
    }

    const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    if (href.indexOf('/') === 0) {
      return (
        <Link
          href={href}
          {...newTabProps}
          className={className}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          prefetch={false}
        >
          {label && label}
          {children && children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        {...newTabProps}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {label && label}
        {children && children}
      </a>
    )
  }

  const buttonProps: ButtonProps = {
    ...buttonPropsFromProps,
    newTab,
    href,
    appearance,
    label,
    onClick,
    onMouseEnter,
    onMouseLeave,
    fullWidth,
    mobileFullWidth,
  }

  if (appearance === 'default') {
    buttonProps.icon = 'arrow'
  }

  return <Button {...buttonProps} className={className} el="link" />
}
