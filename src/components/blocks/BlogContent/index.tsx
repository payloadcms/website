import type { ReusableContent } from '@root/payload-types'

import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import React from 'react'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogContent' }>

export const BlogContent: React.FC<{ disableGutter: boolean } & Props> = ({
  blogContentFields,
  disableGutter,
}) => {
  return (
    <>
      {disableGutter ? (
        <RichText content={blogContentFields.richText} />
      ) : (
        <Gutter>
          <RichText content={blogContentFields.richText} />
        </Gutter>
      )}
    </>
  )
}
