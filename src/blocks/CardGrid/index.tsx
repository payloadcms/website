import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { BlockSpacing } from '@components/BlockSpacing'
import { SquareCard } from '@components/cards/SquareCard'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { PixelBackground } from '@components/PixelBackground'
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
        <hr className={classes.hr} />
        {richText && (
          <Grid className={classes.intro}>
            <Cell cols={8} colsM={8}>
              <RichText className={classes.richText} content={richText} />
            </Cell>
            {hasLinks && (
              <Cell cols={3} colsL={4} start={10} startL={9} startM={1} colsM={8}>
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
              </Cell>
            )}
          </Grid>
        )}
        {hasCards && (
          <div className={classes.cards}>
            <div className={classes.bg}>
              <PixelBackground />
            </div>
            <Grid>
              {cards.map((card, index) => {
                const { title, description, link } = card
                return (
                  <Cell key={index} cols={4}>
                    <SquareCard
                      leader={(index + 1).toString().padStart(2, '0')}
                      className={classes.card}
                      title={title}
                      description={description}
                      link={link}
                    />
                  </Cell>
                )
              })}
            </Grid>
          </div>
        )}
      </Gutter>
    </BlockSpacing>
  )
}
