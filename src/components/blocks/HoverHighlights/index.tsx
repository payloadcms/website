import type { Page } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import React, { Fragment } from 'react'

import { Highlights } from './Highlights/index.js'
import classes from './index.module.scss'

export type HoverHighlightProps = {
  hideBackground?: boolean
} & Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

export const HoverHighlights: React.FC<HoverHighlightProps> = props => {
  const { hideBackground, hoverHighlightsFields } = props
  const { afterHighlights, beforeHighlights, highlights, link, settings } =
    hoverHighlightsFields || {}

  return (
    <BlockWrapper
      className={classes.BlockWrapper}
      hideBackground={hideBackground}
      settings={settings}
    >
      <Gutter className={classes.gutter}>
        <div className={[classes.wrapper, 'grid'].join(' ')}>
          <Highlights
            afterHighlights={afterHighlights}
            beforeHighlights={beforeHighlights}
            button={link}
          >
            {highlights &&
              Array.isArray(highlights) && [
                ...highlights.map((highlight, key) => {
                  const { bottom, top } = highlight.media || {}
                  return (
                    <Fragment key={key}>
                      <CMSLink className={classes.highlightText} {...highlight.link}>
                        {highlight.text}
                        <ArrowIcon bold className={classes.arrow} size="large" />
                      </CMSLink>
                      <div className={classes.highlightMediaTop}>
                        {top && typeof top !== 'string' && (
                          <Media
                            className={[classes.media, classes.mediaTop].join(' ')}
                            resource={top}
                          />
                        )}
                      </div>
                      <div className={classes.highlightMediaBottom}>
                        {bottom && typeof bottom !== 'string' && (
                          <Media
                            className={[classes.media, classes.mediaBottom].join(' ')}
                            resource={bottom}
                          />
                        )}
                      </div>
                    </Fragment>
                  )
                }),
              ]}
          </Highlights>
        </div>
      </Gutter>
      <BackgroundScanline className={classes.rightMargin} />
      <BackgroundGrid zIndex={0} />
    </BlockWrapper>
  )
}
