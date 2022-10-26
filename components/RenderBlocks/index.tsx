import React, { Fragment } from 'react';
import { Page, ReusableContent } from '../../payload-types';
import { toKebabCase } from '../../utilities/toKebabCase';
import { BlockSpacing } from '../BlockSpacing';
import { Banner } from '../blocks/Banner';
import { BlogContent } from '../blocks/BlogContent';
import { Media } from '../blocks/Media';

type ReusableContentBlock = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>


const blockComponents = {
  banner: Banner,
  blogContent: BlogContent,
  mediaBlock: Media
}

export const RenderBlocks: React.FC<{
  blocks: (ReusableContent['layout'][0] | ReusableContentBlock)[]
}> = (props) => {
  const {
    blocks,
  } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const {
            blockName,
            blockType,
          } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];

            if (Block) {
              return (
                <BlockSpacing
                  key={index}
                >
                  <Block
                    id={toKebabCase(blockName)}
                    {...block}
                  />
                </BlockSpacing>
              );
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
