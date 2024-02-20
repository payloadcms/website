import React from 'react'
import Image from 'next/image'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { SquareCard } from '@components/cards/SquareCard'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type HoverCardsProps = Extract<Page['layout'][0], { blockType: 'hoverCards' }> & {
  padding: PaddingProps
}

const Card: React.FC<{
  leader: number
  card: NonNullable<HoverCardsProps['hoverCardsFields']['cards']>[number]
}> = ({ card, leader }) => {
  return (
    <>
      {card.title} {leader}
    </>
  )
}

export const HoverCards: React.FC<HoverCardsProps> = props => {
  const {
    hoverCardsFields: { richText, cards, settings },
    padding,
  } = props

  const hasCards = Array.isArray(cards) && cards.length > 0

  return (
    <BlockWrapper
      settings={{ theme: 'dark' }}
      padding={padding}
      className={[classes.wrapper].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={1} />
      <div className={classes.noiseWrapper}>
        <Image alt="" width={1920} height={946} src="/images/gradients/1.jpg" />
      </div>
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {richText && <RichText className="cols-12 cols-m-8" content={richText} />}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={classes.bg}>
              <BackgroundScanline enableBorders={true} />
            </div>
            <div className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}>
              <BackgroundGrid className={classes.backgroundGrid} ignoreGutter />
              {cards.map((card, index) => {
                return (
                  <div key={index} className={'cols-4'}>
                    <Card card={card} leader={++index} />
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
