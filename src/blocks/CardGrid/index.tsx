import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { BlockSpacing } from '@components/BlockSpacing'
import { SquareCard } from '@components/cards/SquareCard'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type CardGridProps = Extract<Page['layout'][0], { blockType: 'cardGrid' }>

export const CardGrid: React.FC<CardGridProps> = props => {
  const {
    cardGridFields: { richText, cards, links },
  } = props

  const hasCards = Array.isArray(cards) && cards.length > 0
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockSpacing className={classes.cardGrid}>
      <Gutter>
        <BackgroundGrid />
        <div className={classes.introWrapper}>
          <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.emptyCard, 'cols-4'].filter(Boolean).join(' ')}></div>
            {richText && (
              <div className={[classes.richTextWrapper, 'grid'].filter(Boolean).join(' ')}>
                <div className={['cols-10 cols-m-8'].filter(Boolean).join(' ')}>
                  <RichText content={richText} />
                </div>
                {hasLinks && (
                  <div className={'cols-4 start-13 cols-l-5 start-l-13 cols-m-8 start-m-1'}>
                    {links.map(({ link }, index) => {
                      return (
                        <CMSLink
                          {...link}
                          key={index}
                          appearance="default"
                          fullWidth
                          buttonProps={{
                            icon: 'arrow',
                          }}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={classes.bg}>
              <BackgroundScanline />
            </div>
            <div className={'grid'}>
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
    </BlockSpacing>
  )
}
