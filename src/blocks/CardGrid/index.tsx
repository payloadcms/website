'use client'

import React, { CSSProperties, useState } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { SquareCard } from '@components/cards/SquareCard'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type CardGridProps = Extract<Page['layout'][0], { blockType: 'cardGrid' }> & {
  padding: PaddingProps
}

export const CardGrid: React.FC<CardGridProps> = props => {
  const {
    cardGridFields: { richText, cards, links, settings, revealDescription },
    padding,
  } = props

  const [index, setIndex] = useState(0)

  const cardLength = cards?.length ?? 0
  const hasCards = Array.isArray(cards) && cardLength > 0
  const hasLinks = Array.isArray(links) && links.length > 0
  const excessLength = cardLength > 4 ? 8 - cardLength : 4 - cardLength

  const wrapperStyle: CSSProperties = {
    '--excess-length-large': excessLength,
    '--excess-length-mid': cardLength % 2 === 0 ? 0 : 1,
  } as CSSProperties

  return (
    <BlockWrapper
      settings={settings}
      padding={{ ...padding, top: 'large' }}
      className={[classes.cardGrid].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={1} />
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {richText && (
            <div className={[classes.richTextWrapper, 'grid'].filter(Boolean).join(' ')}>
              <div className={[classes.richText, 'cols-10 cols-m-8'].filter(Boolean).join(' ')}>
                <RichText content={richText} />
              </div>
              {hasLinks && (
                <div
                  className={[classes.linksWrapper, 'cols-4 start-13 cols-l-4 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {links.map(({ link }, index) => {
                    return (
                      <CMSLink
                        {...link}
                        key={index}
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
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={classes.margins}>
              <BackgroundScanline enableBorders={true} className={classes.marginLeft} />
              <BackgroundScanline enableBorders={true} className={classes.marginRight} />
            </div>
            <div
              className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}
              style={wrapperStyle}
            >
              {cards.map((card, index) => {
                const { title, description, enableLink, link } = card
                return (
                  <div
                    key={index}
                    className={'cols-4 cols-s-8'}
                    onMouseEnter={() => setIndex(index + 1)}
                    onMouseLeave={() => setIndex(0)}
                  >
                    <SquareCard
                      leader={(index + 1).toString().padStart(2, '0')}
                      className={classes.card}
                      title={title}
                      description={description}
                      enableLink={enableLink}
                      link={link}
                      revealDescription={revealDescription}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
