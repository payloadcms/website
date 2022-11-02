import Link from 'next/link'
import React from 'react'
import { CaseStudy, Page, Post, UseCase } from '../../payload-types'
// eslint-disable-next-line import/no-cycle
import { Button } from '../Button'

export type Reference =
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

type CMSLinkType = {
  type?: 'reference' | 'custom'
  newTab?: boolean
  reference: Reference
  url: string
  label: string
  appearance?: 'default' | 'primary' | 'secondary'
  children?: React.ReactNode
  className?: string
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
}) => {
  let href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `/${reference.value.slug}`
      : url

  if (!href) return null

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
        <Link href={href} {...newTabProps} className={className}>
          {label && label}
          {children && children}
        </Link>
      )
    }

    return (
      <a href={url} {...newTabProps} className={className}>
        {label && label}
        {children && children}
      </a>
    )
  }

  const buttonProps = {
    newTab,
    href,
    appearance,
    label,
  }

  return <Button {...buttonProps} className={className} el="link" />
}
