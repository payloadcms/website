import type { CMSLinkType } from '@components/CMSLink/index.js'
import type { Media, Post } from '@root/payload-types.js'

export interface SharedProps {
  className?: string
  description?: null | string
  price?: null | string
  title?: null | string
}

export interface SquareCardProps extends SharedProps {
  enableLink?: boolean | null
  leader?: string
  link?: CMSLinkType
  revealDescription?: boolean | null
}

export interface ContentMediaCardProps extends SharedProps {
  authors: Post['authors']
  href: string
  media: Media | string
  orientation?: 'horizontal' | 'vertical'
  publishedOn?: string
}

export interface PricingCardProps extends SharedProps {
  hasPrice?: boolean | null
  leader?: string
  link?: CMSLinkType
}

export interface DefaultCardProps extends SharedProps {
  href?: string
  leader?: string
  media?: Media | null | string
  onClick?: () => void
  pill?: string
}
