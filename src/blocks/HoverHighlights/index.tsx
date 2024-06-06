import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockWrapper } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Page } from '@root/payload-types'
import { Highlights } from './Highlights'

import classes from './index.module.scss'

export type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

export const HoverHighlights: React.FC<HoverHighlightProps> = props => {
  const { hoverHighlightsFields } = props
  const { settings, beforeHighlights, highlights, afterHighlights, link } =
    hoverHighlightsFields || {}

  return (
    <BlockWrapper settings={settings} className={classes.BlockWrapper}>
      <Gutter className={classes.gutter}>
        <div className={[classes.wrapper, 'grid'].join(' ')}>
          <Highlights
            beforeHighlights={beforeHighlights}
            afterHighlights={afterHighlights}
            button={link}
          >
            {highlights &&
              Array.isArray(highlights) && [
                ...highlights.map(highlight => {
                  const { topLeft, topRight, bottomLeft, bottomRight } = highlight.media || {}
                  return (
                    <>
                      <CMSLink className={classes.highlightText} {...highlight.link}>
                        {highlight.text}
                        <ArrowIcon className={classes.arrow} size="large" bold />
                      </CMSLink>
                      <div className={classes.highlightMediaLeft}>
                        {topLeft && typeof topLeft !== 'string' && (
                          <Media
                            resource={topLeft}
                            className={[classes.media, classes.mediaTopLeft].join(' ')}
                          />
                        )}
                        {topRight && typeof topRight !== 'string' && (
                          <Media
                            resource={topRight}
                            className={[classes.media, classes.mediaTopRight].join(' ')}
                          />
                        )}
                      </div>
                      <div className={classes.highlightMediaRight}>
                        {bottomLeft && typeof bottomLeft !== 'string' && (
                          <Media
                            resource={bottomLeft}
                            className={[classes.media, classes.mediaBottomLeft].join(' ')}
                          />
                        )}
                        {bottomRight && typeof bottomRight !== 'string' && (
                          <Media
                            resource={bottomRight}
                            className={[classes.media, classes.mediaBottomRight].join(' ')}
                          />
                        )}
                      </div>
                    </>
                  )
                }),
              ]}
          </Highlights>
        </div>
      </Gutter>
      <BackgroundScanline className={classes.leftMargin} />
      <BackgroundScanline className={classes.rightMargin} />
      <BackgroundGrid zIndex={0} />
    </BlockWrapper>
  )
}
