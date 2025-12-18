import { usePopulateDocument } from '@hooks/usePopulateDocument'
import { type Media, type PayloadMediaBlock as PayloadMediaBlockType } from '@root/payload-types'

import { LightDarkImage } from '../LightDarkImage'

export const PayloadMediaBlock: React.FC<PayloadMediaBlockType> = (fields) => {
  const { data: media } = usePopulateDocument<Media>({
    id: typeof fields.media === 'object' ? fields.media.id : fields.media,
    collection: 'media',
    depth: 1,
    enabled: typeof fields.media !== 'object',
    fallback: fields?.media as Media,
  })

  if (typeof media !== 'object') {
    return <p>Loading...</p>
  }

  return (
    <LightDarkImage
      alt={media?.alt ?? ''}
      caption={fields?.caption ?? ''}
      srcDark={
        typeof media?.darkModeFallback === 'object'
          ? (media?.darkModeFallback?.url ?? undefined)
          : undefined
      }
      srcDarkId={typeof media?.darkModeFallback !== 'object' ? media?.darkModeFallback : undefined}
      srcLight={media?.url ?? undefined}
    />
  )
}
