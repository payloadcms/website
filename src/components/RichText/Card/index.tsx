'use client'

import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import './index.scss'

interface CardProps {
  description: string
  link: string
  title: string
}

const DOCS_VARIANT = /^\/docs\/(local|v2|dynamic)(?=\/)/

// Mirror an absolute `/docs/X` link into the current docs variant route
// (`/docs/local/X`, `/docs/v2/X`, etc.) so authors can write the canonical
// production path and have it resolve correctly under any variant.
function resolveLink(link: string, pathname: null | string): string {
  if (!pathname || !link.startsWith('/docs/')) return link
  const match = pathname.match(DOCS_VARIANT)
  if (!match) return link
  const variant = match[1]
  if (link.startsWith(`/docs/${variant}/`)) return link
  return link.replace('/docs/', `/docs/${variant}/`)
}

export const Card: React.FC<CardProps> = ({ description, link, title }) => {
  const pathname = usePathname()
  const href = resolveLink(link, pathname)

  return (
    <Link className="docs-card" href={href}>
      <div className="docs-card__title-row">
        <h4 className="docs-card__title">{title}</h4>
        <ArrowIcon className="docs-card__icon" />
      </div>
      <p className="docs-card__description">{description}</p>
      <BackgroundScanline className="docs-card__scanlines" />
    </Link>
  )
}
