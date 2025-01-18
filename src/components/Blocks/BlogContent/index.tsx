import type { ReusableContent } from '@root/payload-types.js'

import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
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
