import React from 'react'

import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { ReusableContent } from '@root/payload-types'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogContent' }>

export const BlogContent: React.FC<Props> = ({ blogContentFields }) => {
  return (
    <Gutter>
      <div className={'grid'}>
        <div className={'cols-8 start-5 cols-m-6 start-m-2 cols-s-8 start-s-1'}>
          <RichText content={blogContentFields.richText} />
        </div>
      </div>
    </Gutter>
  )
}
