import React from 'react'

import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { ReusableContent } from '@root/payload-types'

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
