import React from 'react'
import { ReusableContent } from '../../../payload-types'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'banner' }>

export const Banner: React.FC<Props> = () => {
  return (
    <div>
      Banner
    </div>
  )
}