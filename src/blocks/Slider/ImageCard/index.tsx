import * as React from 'react'
import { Media } from '@components/Media'
import { Page } from '@root/payload-types'

type Props = Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['imageSlides'][0]

export const ImageCard: React.FC<Props> = ({ image }) => {
  if (typeof image === 'string') return null

  return <Media resource={image} />
}
