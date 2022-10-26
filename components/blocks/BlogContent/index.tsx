import React from 'react'
import { ReusableContent } from '../../../payload-types'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogContent' }>

export const BlogContent: React.FC<Props> = () => {
  return (
    <div>
      Blog Content
    </div>
  )
}