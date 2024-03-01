'use client'
import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import SplitAnimate from '@components/SplitAnimate'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type StatementProps = Extract<Page['layout'][0], { blockType: 'statement' }> & {
  padding?: PaddingProps
}

export const Statement: React.FC<StatementProps> = props => {
  const {
    statementFields: { richText, links, settings },
    padding,
  } = props

  const hasLinks = links && links.length > 0

  return (
    <BlockWrapper settings={settings} padding={padding}>
      <BackgroundGrid zIndex={0} />
      <Gutter className={classes.statementWrap}>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.statement, 'cols-8 start-5 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <RichText content={richText} className={classes.content} />
            {hasLinks && (
              <div className={[classes.links].filter(Boolean).join(' ')}>
                {links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      {...link}
                      key={i}
                      appearance="default"
                      fullWidth
                      buttonProps={{
                        icon: 'arrow',
                        hideHorizontalBorders: true,
                        hideBottomBorderExceptLast: true,
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
