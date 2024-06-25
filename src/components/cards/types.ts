import type { CMSLinkType } from '@components/CMSLink/index.js'
import type { Media, Post } from '@root/payload-types.js'

export interface SharedProps {
  price?: string | null
  title?: string | null
  description?: string | null
  className?: string
}

export interface SquareCardProps extends SharedProps {
  leader?: string
  enableLink?: boolean | null
  link?: CMSLinkType
  revealDescription?: boolean | null
}

export interface ContentMediaCardProps extends SharedProps {
  media: Media | string
  href: string
  publishedOn?: string
  authors: Post['authors']
  orientation?: 'horizontal' | 'vertical'
}

export interface PricingCardProps extends SharedProps {
  leader?: string
  link?: CMSLinkType
  hasPrice?: boolean | null
}

export interface DefaultCardProps extends SharedProps {
  leader?: string
  pill?: string
  media?: Media | string | null
  href?: string
  onClick?: () => void
}
