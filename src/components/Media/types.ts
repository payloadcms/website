import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'
import type { UploadCollectionSlug, TypedUploadCollection } from 'payload'

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  height?: null | number
  htmlElement?: ElementType | null
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: TypedUploadCollection[UploadCollectionSlug] // for Payload media
  sizes?: string // for NextImage only
  src?: null | StaticImageData | string // for static media
  videoClassName?: string
  width?: null | number
}
