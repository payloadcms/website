import type { CMSLinkType } from '@components/CMSLink'
import type { Media } from '@root/payload-types'

export interface SharedProps {
  title: string
  description: string
  className?: string
}

export interface SquareCardProps extends SharedProps {
  leader?: string
  link: CMSLinkType
}

export interface BlogCardProps extends SharedProps {
  media: Media | string
  href: string
}
