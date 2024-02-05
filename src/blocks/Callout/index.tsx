import React, { Fragment } from 'react'
import { ArrowIcon } from '@icons/ArrowIcon'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockSpacing } from '@components/BlockSpacing'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { QuoteIconAlt } from '@root/icons/QuoteIconAlt'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type CalloutProps = Extract<Page['layout'][0], { blockType: 'callout' }>

const QuoteContent: React.FC<Pick<CalloutProps['calloutFields'], 'quote' | 'author' | 'logo'>> = ({
  quote,
  author,
  logo,
}) => {
  return (
    <div
      className={[classes.quoteContent, 'cols-6 start-2 cols-m-8 start-m-1']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.quoteContainer}>
        <QuoteIconAlt className={classes.quoteIcon} />
        <div className={[classes.quote, 'cols-12'].filter(Boolean).join(' ')}>{quote}”</div>

        <div className={[classes.authorWrapper, 'cols-12'].filter(Boolean).join(' ')}>
          <div className={classes.logo}>
            {logo && typeof logo !== 'string' && <Media resource={logo} />}
          </div>
          <div className={classes.author}>{author}</div>
        </div>
      </div>
    </div>
  )
}

export const Callout: React.FC<CalloutProps> = props => {
  const {
    calloutFields: { richText, links, quote, style: calloutStyle, author, logo, media },
  } = props

  const hasLinks = links && links.length > 0
  const style = calloutStyle ?? 'default'
  const styleClass = style === 'default' ? classes.defaultStyle : classes.quoteStyle

  return (
    <BlockSpacing>
      <div className={classes.wrapper}>
        <Gutter>
          <BackgroundGrid className={classes.backgroundGrid} />
          <div className={[classes.container, 'grid', styleClass].filter(Boolean).join(' ')}>
            {style === 'quote' ? (
              <QuoteContent quote={quote} author={author} logo={logo} />
            ) : (
              <div
                className={[classes.contentWrapper, 'cols-6 start-2 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                <RichText
                  content={richText}
                  className={[classes.content].filter(Boolean).join(' ')}
                />
                <div className={[classes.linksContainer].filter(Boolean).join(' ')}>
                  {hasLinks && (
                    <div className={[classes.links, ''].filter(Boolean).join(' ')}>
                      {links.map(({ link }, index) => (
                        <CMSLink
                          {...link}
                          key={index}
                          appearance={'default'}
                          buttonProps={{
                            appearance: 'default',
                            hideBottomBorderExceptLast: true,
                          }}
                          className={[classes.link].filter(Boolean).join(' ')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className={[classes.media, styleClass, 'cols-8 start-9 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {media && typeof media !== 'string' && <Media resource={media} />}
            </div>
          </div>
        </Gutter>
      </div>
    </BlockSpacing>
  )
}
