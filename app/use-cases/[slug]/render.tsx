'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Gutter } from '../../../components/Gutter'

import { UseCase } from '../../../payload-types'
import Breadcrumbs from '../../../components/Breadcrumbs'
import { RichText } from '../../../components/RichText'
import { Media } from '../../../components/Media'
import { RenderBlocks } from '../../../components/RenderBlocks'

import classes from './index.module.scss'

export const RenderUseCase: React.FC<UseCase> = props => {
  const { title, heroMedia, introContent, layout } = props

  return (
    <React.Fragment>
      <Gutter>
        <Breadcrumbs
          items={[
            {
              label: 'Use Cases',
              href: `/use-cases`,
            },
            {
              label: title,
            },
          ]}
        />
        <Grid>
          <Cell cols={9}>
            <RichText content={introContent} />
          </Cell>

          <Cell start={10} cols={3}>
            {typeof heroMedia !== 'string' && (
              <div className={classes.featuredMediaWrap}>
                <Media resource={heroMedia} />
              </div>
            )}
          </Cell>
        </Grid>
      </Gutter>

      <RenderBlocks blocks={layout} />
    </React.Fragment>
  )
}

export default RenderUseCase
