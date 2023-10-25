import type { CMSLinkType } from '@components/CMSLink'
import type { Media } from '@root/payload-types'

export interface SharedProps {
  price?: string
  title?: string
  description?: string
  className?: string
}

export interface SquareCardProps extends SharedProps {
  leader?: string
  link?: CMSLinkType
}

export interface ContentMediaCardProps extends SharedProps {
  media: Media | string
  href: string
  orientation?: 'horizontal' | 'vertical'
}

export interface PricingCardProps extends SharedProps {
  leader?: string
  link?: CMSLinkType
}

export interface DefaultCardProps extends SharedProps {
  leader?: string
  pill?: string
  media?: Media | string
  href?: string
  onClick?: () => void
}
