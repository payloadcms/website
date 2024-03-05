import React from 'react'

import { RenderBlocks } from '@components/RenderBlocks'
import { Page } from '@root/payload-types'

export type Props = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

export const ReusableContentBlock: React.FC<Props> = ({ reusableContentBlockFields }) => {
  const { reusableContent, customId } = reusableContentBlockFields

  if (typeof reusableContent === 'object' && reusableContent !== null) {
    return <RenderBlocks blocks={reusableContent.layout} disableGutter customId={customId} />
  }

  return null
}
