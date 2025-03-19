import type { Page } from '@root/payload-types'

import { RenderBlocks } from '@components/RenderBlocks/index'
import React from 'react'

export type Props = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

export const ReusableContentBlock: React.FC<Props> = ({ reusableContentBlockFields }) => {
  const { customId, reusableContent } = reusableContentBlockFields

  if (typeof reusableContent === 'object' && reusableContent !== null) {
    return <RenderBlocks blocks={reusableContent.layout} customId={customId} disableGutter />
  }

  return null
}
