import type { CMSLinkType } from '@components/CMSLink'
import type { Media } from '@root/payload-types'

export interface SharedProps {
  title: string
  description: string
  className?: string
}

export interface SquareCardProps extends SharedProps {
  cardType: 'square'
  leader?: string
  media?: never
  link: CMSLinkType
  href?: never
}

export interface BlogCardProps extends SharedProps {
  cardType: 'blog'
  leader?: never
  media: Media | string
  href: string
  link?: never
}

export type CardProps = SquareCardProps | BlogCardProps
