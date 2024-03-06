'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@components/BlockWrapper'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type HoverCardsProps = Extract<Page['layout'][0], { blockType: 'hoverCards' }> & {
  padding: PaddingProps
}

const Card: React.FC<{
  leader: number
  card: NonNullable<HoverCardsProps['hoverCardsFields']['cards']>[number]
  setHover: Dispatch<SetStateAction<number>>
}> = ({ card, leader, setHover }) => {
  return (
    <div
      className={classes.cardWrapper}
      onMouseEnter={() => setHover(++leader)}
      onMouseLeave={() => setHover(1)}
    >
      <CMSLink className={classes.card} {...card.link}>
        <p className={classes.leader}>0{leader}</p>
        <div className={classes.cardContent}>
          <h3 className={classes.cardTitle}>{card.title}</h3>
          <p className={classes.description}>{card.description}</p>
        </div>
        <ArrowIcon className={classes.arrow} />
      </CMSLink>
    </div>
  )
}

export const HoverCards: React.FC<HoverCardsProps> = props => {
  const {
    hoverCardsFields: { richText, cards, settings },
    padding,
  } = props
  const [activeGradient, setActiveGradient] = useState(1)

  const gradients = [1, 2, 3, 4]

  const hasCards = Array.isArray(cards) && cards.length > 0

  return (
    <BlockWrapper
      settings={{ theme: 'dark' }}
      padding={{ bottom: 'large', top: 'large' }}
      className={[classes.wrapper].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={1} />
      <div className={classes.noiseWrapper}>
        {gradients.map(gradient => {
          return (
            <Image
              key={gradient}
              alt=""
              className={[classes.bg, activeGradient === gradient && classes.activeBg]
                .filter(Boolean)
                .join(' ')}
              width={1920}
              height={946}
              src={`/images/gradients/${gradient}.jpg`}
            />
          )
        })}
      </div>
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {richText && (
            <RichText
              className={[classes.richText, 'cols-12 cols-m-8'].filter(Boolean).join(' ')}
              content={richText}
            />
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}>
              <BackgroundGrid className={classes.backgroundGrid} ignoreGutter />
              {cards.map((card, index) => {
                return (
                  <div key={index} className={'cols-4 cols-s-8'}>
                    <Card card={card} leader={++index} setHover={setActiveGradient} />
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
