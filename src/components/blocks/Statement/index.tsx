'use client'
import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import Code from '@components/Code/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { RichText } from '@components/RichText/index'
import React from 'react'

import classes from './index.module.scss'

export type StatementProps = {
  hideBackground?: boolean
  padding?: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'statement' }>

export const Statement: React.FC<StatementProps> = (props) => {
  const {
    hideBackground,
    padding,
    statementFields: {
      assetCaption,
      assetType,
      backgroundGlow,
      code,
      links,
      media,
      mediaWidth,
      richText,
      settings,
    },
  } = props

  const hasLinks = links && links.length > 0

  const mediaWidthClass =
    mediaWidth === 'small'
      ? 'cols-8 start-5 cols-m-8 start-m-1'
      : mediaWidth === 'large'
        ? 'cols-16 cols-m-8'
        : mediaWidth === 'full'
          ? 'cols-16 cols-m-8'
          : 'cols-12 start-3 cols-m-8 start-m-1'

  return (
    <BlockWrapper hideBackground={hideBackground} padding={padding} settings={settings}>
      <BackgroundGrid zIndex={0} />
      <Gutter className={classes.statementWrap}>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.statement, 'cols-8 start-5 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <RichText className={classes.content} content={richText} />
            {hasLinks && (
              <div className={[classes.links].filter(Boolean).join(' ')}>
                {links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      {...link}
                      appearance="default"
                      buttonProps={{
                        hideBottomBorderExceptLast: true,
                        hideHorizontalBorders: true,
                        icon: 'arrow',
                      }}
                      fullWidth
                      key={i}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
        {(media || code) && (
          <div className={[classes.assetWrap, 'grid'].join(' ')}>
            {assetType === 'media'
              ? media &&
                typeof media !== 'string' && (
                  <div
                    className={[mediaWidthClass, mediaWidth === 'full' && classes.fullMedia]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Media
                      className={[mediaWidthClass, backgroundGlow && classes[backgroundGlow]]
                        .filter(Boolean)
                        .join(' ')}
                      resource={media}
                    />
                  </div>
                )
              : code && (
                  <div
                    className={[
                      backgroundGlow && classes[backgroundGlow],
                      'cols-10 start-4 cols-m-8 start-m-1',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Code className={classes.codeBlock}>{code}</Code>
                  </div>
                )}
            {assetCaption && (
              <div className={classes.assetCaption}>
                <span>{assetCaption}</span>
              </div>
            )}
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
