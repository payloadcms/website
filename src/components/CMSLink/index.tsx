import type { CaseStudy, Page, Post } from '@root/payload-types'

import Link from 'next/link'
import React from 'react'
// eslint-disable-next-line import/no-cycle
import type { ButtonProps } from '../Button/index'

import { Button } from '../Button/index'

const relationSlugs = {
  case_studies: 'case-studies',
}

type PageReference = {
  relationTo: 'pages'
  value: Page | string
}

type PostsReference = {
  relationTo: 'posts'
  value: Post | string
}

type CaseStudyReference = {
  relationTo: (typeof relationSlugs)['case_studies']
  value: CaseStudy | string
}

export type LinkType = 'custom' | 'reference' | null
export type Reference = CaseStudyReference | null | PageReference | PostsReference

export type CMSLinkType = {
  appearance?: 'default' | 'primary' | 'secondary' | 'text' | null
  buttonProps?: ButtonProps
  children?: React.ReactNode
  className?: string
  customId?: null | string
  fullWidth?: boolean
  label?: null | string
  mobileFullWidth?: boolean
  newTab?: boolean | null
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  reference?: null | Reference
  type?: LinkType | null
  url?: null | string
}

type GenerateSlugType = {
  reference?: null | Reference
  type?: LinkType | null
  url?: null | string
}
const generateHref = (args: GenerateSlugType): string => {
  const { type, reference, url } = args

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
  appearance,
  buttonProps: buttonPropsFromProps,
  children,
  className,
  customId,
  fullWidth = false,
  label,
  mobileFullWidth = false,
  newTab,
  onClick,
  onMouseEnter,
  onMouseLeave,
  reference,
  url,
}) => {
  let href = generateHref({ type, reference, url })

  if (!href) {
    return (
      <span
        className={className}
        id={customId ?? ''}
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
    const hrefIsLocal = ['tel:', 'mailto:', '/'].some((prefix) => href.startsWith(prefix))

    if (!hrefIsLocal && href !== '#') {
      try {
        const objectURL = new URL(href)
        if (objectURL.origin === process.env.NEXT_PUBLIC_SITE_URL) {
          href = objectURL.href.replace(process.env.NEXT_PUBLIC_SITE_URL, '')
        }
      } catch (e) {
        // Do not throw error if URL is invalid
        // This will prevent the page from building
        //console.log(`Failed to format url: ${href}`, e) // eslint-disable-line no-console
      }
    }

    const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

    if (href.indexOf('/') === 0) {
      return (
        <Link
          href={href}
          {...newTabProps}
          className={className}
          id={customId ?? ''}
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
        id={customId ?? ''}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label && label}
        {children && children}
      </a>
    )
  }

  const buttonProps: ButtonProps = {
    ...buttonPropsFromProps,
    appearance,
    fullWidth,
    href,
    label,
    mobileFullWidth,
    newTab,
    onClick,
    onMouseEnter,
    onMouseLeave,
  }

  if (appearance === 'default') {
    buttonProps.icon = 'arrow'
  }

  return <Button {...buttonProps} className={className} el="link" id={customId ?? ''} />
}
