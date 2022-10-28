import React, { Fragment } from 'react'
import { Page, ReusableContent } from '../../payload-types'
import { toKebabCase } from '../../utilities/to-kebab-case'
import { BlockSpacing } from '../BlockSpacing'
import { BannerBlock } from '../blocks/Banner'
import { BlogContent } from '../blocks/BlogContent'
import { MediaBlock } from '../blocks/MediaBlock'

type ReusableContentBlock = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

const blockComponents = {
  banner: BannerBlock,
  blogContent: BlogContent,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: (ReusableContent['layout'][0] | ReusableContentBlock)[]
}> = props => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <BlockSpacing key={index}>
                  <Block id={toKebabCase(blockName)} {...block} />
                </BlockSpacing>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
