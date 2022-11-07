'use client'

import { BlockSpacing } from '@components/BlockSpacing'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { Page } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import { Card } from '../../Card'
import classes from './index.module.scss'

export type CardGridProps = Extract<Page['layout'][0], { blockType: 'cardGrid' }>

export const CardGrid: React.FC<CardGridProps> = props => {
  const {
    cardGridFields: { richText, cards },
  } = props

  const hasCards = Array.isArray(cards) && cards.length > 0

  return (
    <BlockSpacing className={classes.cardGrid}>
      <Gutter>
        {richText && <RichText className={classes.richText} content={richText} />}
        {hasCards && (
          <div className={classes.cards}>
            <div className={classes.bg}>
              <PixelBackground />
            </div>
            <Grid>
              {cards.map((card, index) => {
                const { title, description, link } = card
                return (
                  <Cell key={index} cols={3} colsL={4} colsM={4} colsS={8}>
                    <Card
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
