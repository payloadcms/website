import Link from 'next/link'
import React from 'react'
import { CaseStudy, Page, Post, UseCase } from '../../payload-types'
import { Button } from '../Button'

type CMSLinkType = {
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
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `/${reference.value.slug}`
      : url

  if (!href) return null

  if (!appearance) {
    const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    if (type === 'custom') {
      return (
        <a href={url} {...newTabProps} className={className}>
          {label && label}
          {children && children}
        </a>
      )
    }

    if (href) {
      return (
        <Link href={href} {...newTabProps} className={className}>
          {label && label}
          {children && children}
        </Link>
      )
    }
  }

  const buttonProps = {
    newTab,
    href,
    appearance,
    label,
  }

  return <Button className={className} {...buttonProps} el="link" />
}
