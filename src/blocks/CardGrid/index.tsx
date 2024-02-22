import React from 'react'

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
    cardGridFields: { richText, cards, links, settings },
    padding,
  } = props

  const hasCards = Array.isArray(cards) && cards.length > 0
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockWrapper
      settings={settings}
      padding={padding}
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
            <div className={classes.bg}>
              <BackgroundScanline enableBorders={true} />
            </div>
            <div className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}>
              {cards.map((card, index) => {
                const { title, description, link } = card
                return (
                  <div key={index} className={'cols-4'}>
                    <SquareCard
                      leader={(index + 1).toString().padStart(2, '0')}
                      className={classes.card}
                      title={title}
                      description={description}
                      link={link}
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
