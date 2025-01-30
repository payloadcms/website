'use client'

import type { BlocksProp } from '@components/RenderBlocks/index.js'
import type { Page } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { Breadcrumbs } from '@components/Breadcrumbs/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { useGetHeroPadding } from '@components/Hero/useGetHeroPadding.js'
import { RichText } from '@components/RichText/index.js'
import React from 'react'

import classes from './index.module.scss'

export const DefaultHero: React.FC<
  {
    firstContentBlock?: BlocksProp
  } & Pick<Page['hero'], 'description' | 'richText' | 'theme'>
> = ({ description, firstContentBlock, richText, theme }) => {
  const withoutDescription = !description || description.root.children.length < 1

  return (
    <BlockWrapper padding={{ bottom: 'small', top: 'small' }} settings={{ theme }}>
      <Gutter>
        <BackgroundGrid zIndex={0} />
        <div className={classes.defaultHero}>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <div className={[`cols-8 start-1`, `cols-m-8`, 'cols-s-8'].filter(Boolean).join(' ')}>
              <RichText className={classes.richText} content={richText} />
            </div>

            {!withoutDescription && (
              <div className={['cols-4 start-13 cols-m-8 start-m-1'].filter(Boolean).join(' ')}>
                <RichText content={description} />
              </div>
            )}
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
