import * as React from 'react'
import { Page } from '../../../../payload-types'
import { Media } from '../../../Media'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['imageSlides'][0]

export const ImageCard: React.FC<Props> = ({ image }) => {
  if (typeof image === 'string') return null

  return <Media resource={image} />
}
