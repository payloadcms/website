import Link from 'next/link'
import React from 'react'
import { CaseStudy, Page, Post, UseCase } from '../../payload-types'
// eslint-disable-next-line import/no-cycle
import { Button, Props as ButtonProps } from '../Button'

type PageReference = {
  value: string | Page
  relationTo: 'pages'
}

type UseCaseReference = {
  value: string | UseCase
  relationTo: 'use-cases'
}

type PostsReference = {
  value: string | Post
  relationTo: 'posts'
}

type CaseStudyReference = {
  value: string | CaseStudy
  relationTo: 'case-studies'
}

export type LinkType = 'reference' | 'custom'
export type Reference = PageReference | UseCaseReference | PostsReference | CaseStudyReference

type CMSLinkType = {
  type?: LinkType
  newTab?: boolean
  reference: Reference
  url: string
  label?: string
  appearance?: 'default' | 'primary' | 'secondary'
  children?: React.ReactNode
  fullWidth?: boolean
  className?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

type GenerateSlugType = {
  type: LinkType
  url?: string
  reference?: Reference
}
const generateHref = (args: GenerateSlugType): string => {
  const { reference, url, type } = args

  if (type === 'custom') {
    return url
  }

  if (reference?.value && typeof reference.value !== 'string') {
    if (reference.relationTo === 'pages') {
      return `/${reference.value.slug}`
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
  onMouseEnter,
  onMouseLeave,
  fullWidth = false,
}) => {
  let href = generateHref({ type, url, reference })

  if (!href) {
    return (
      <span className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {label}
        {children}
      </span>
    )
  }

  if (!appearance) {
    const hrefIsLocal = ['tel:', 'mailto:', '/'].some(prefix => href.startsWith(prefix))

    if (!hrefIsLocal) {
      try {
        const objectURL = new URL(href)
        if (objectURL.origin === process.env.NEXT_PUBLIC_APP_URL) {
          href = objectURL.href.replace(process.env.NEXT_PUBLIC_APP_URL, '')
        }
      } catch (e) {
        console.error(`Failed to format url: ${href}`, e)
      }
    }

    const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    if (href.indexOf('/') === 0) {
      return (
        <Link
          href={href}
          {...newTabProps}
          className={className}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {label && label}
          {children && children}
        </Link>
      )
    }

    return (
      <a
        href={url}
        {...newTabProps}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label && label}
        {children && children}
      </a>
    )
  }

  const buttonProps: ButtonProps = {
    newTab,
    href,
    appearance,
    label,
    onMouseEnter,
    onMouseLeave,
    fullWidth,
  }

  if (appearance === 'default') {
    buttonProps.icon = 'arrow'
  }

  return <Button {...buttonProps} className={className} el="link" />
}
