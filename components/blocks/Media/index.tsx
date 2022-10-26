import React from 'react'
import { ReusableContent } from '../../../payload-types'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'mediaBlock' }>

export const Media: React.FC<Props> = () => {
  return (
    <div>
      Media
    </div>
  )
}