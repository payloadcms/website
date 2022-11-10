import React from 'react'
import { Page } from '@root/payload-types'
import { RenderBlocks } from '@components/RenderBlocks'

export type Props = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

export const ReusableContentBlock: React.FC<Props> = ({ reusableContentBlockFields }) => {
  const { reusableContent } = reusableContentBlockFields

  if (typeof reusableContent === 'object') {
    return <RenderBlocks blocks={reusableContent.layout} />
  }

  return null
}
