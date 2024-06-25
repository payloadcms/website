import React from 'react'

import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
import { ReusableContent } from '@root/payload-types.js'

type Props = Extract<ReusableContent['layout'][0], { blockType: 'blogContent' }>

export const BlogContent: React.FC<Props & { disableGutter: boolean }> = ({
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
