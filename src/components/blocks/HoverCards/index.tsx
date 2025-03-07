'use client'
import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'
import type { Dispatch, SetStateAction } from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { CMSLink } from '@components/CMSLink/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import classes from './index.module.scss'

export type HoverCardsProps = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'hoverCards' }>

const Card: React.FC<{
  card: NonNullable<HoverCardsProps['hoverCardsFields']['cards']>[number]
  leader: number
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

export const HoverCards: React.FC<HoverCardsProps> = (props) => {
  const { hideBackground, hoverCardsFields, padding } = props
  const [activeGradient, setActiveGradient] = useState(1)

  const gradients = [1, 2, 3, 4, 5]

  const hasCards = Array.isArray(hoverCardsFields.cards) && hoverCardsFields.cards.length > 0

  return (
    <BlockWrapper
      className={[classes.wrapper].filter(Boolean).join(' ')}
      hideBackground={hideBackground}
      padding={{ bottom: 'large', top: 'large' }}
      settings={{ theme: 'dark' }}
    >
      <BackgroundGrid zIndex={1} />
      {!hideBackground && !hoverCardsFields.hideBackground && (
        <div className={classes.noiseWrapper}>
          {gradients.map((gradient) => {
            return (
              <Image
                alt=""
                className={[classes.bg, activeGradient === gradient && classes.activeBg]
                  .filter(Boolean)
                  .join(' ')}
                height={946}
                key={gradient}
                src={`/images/gradients/${gradient === 5 ? 2 : gradient}.jpg`}
                width={1920}
              />
            )
          })}
        </div>
      )}
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {hoverCardsFields.richText && (
            <RichText
              className={[classes.richText, 'cols-12 cols-m-8'].filter(Boolean).join(' ')}
              content={hoverCardsFields.richText}
            />
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}>
              <BackgroundGrid className={classes.backgroundGrid} ignoreGutter />
              {hoverCardsFields.cards &&
                hoverCardsFields.cards.map((card, index) => {
                  return (
                    <div className={'cols-4 cols-s-8'} key={card.id}>
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
